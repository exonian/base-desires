import fs from 'fs';
import path from 'path';
import PdfParse from 'pdf-parse';
import pdf  from 'pdf-parse';
import { toStandard } from '../text';


let options: PdfParse.Options = {
// @ts-expect-error
    pagerender: parse_text
}

type TPageData = {
    getTextContent: () => Promise<TTextContent>
}

type TTextContent = {
    items: TTextItem[]
}

type TTextItem = {
    transform: number[]
    width: number
    height: number
    str: string
}

function parse_text(pageData: TPageData) :Promise<string> {
    return pageData.getTextContent()
    .then(function(textContent: TTextContent) {

        let lastX: number = 0, lastY: number = 0, lastWidth:number = 0, lastHeight:number = 0;
        let text:string = '';
        for (let item of textContent.items) {
            let cleanedText = clean_text(item.str)

            let currentX = item.transform[4]
            let currentY = item.transform[5]
            if (currentX < lastX - 110 || Math.abs(item.height - lastHeight) > 1.5 || currentY > lastY + 100) {
                text += '\n' + cleanedText;
            }
            else {
                if (currentX > lastX + lastWidth + 8) {
                    text += '||' + cleanedText;
                }
                else {
                    text += cleanedText;
                }
            }
            lastX = item.transform[4];
            lastY = item.transform[5];
            lastWidth = item.width;
            lastHeight = item.height;
        }
        return text;
    });
}


function clean_text(text: string) :string {
    text = text.replaceAll("×", "x")  // for searching
    text = text.replaceAll("’", "'")  // for searching
    text = text.replaceAll("�", ".")  // for display and search
    text = text.replace(/(\d) {0,1}(\d) {0,1}m {0,1}m/g, "$1$2mm")  // remove spaces in simple sizes
    text = text.replace(/\s+/g,' ')  // nbsps, which interfere with searching, and extraneous spaces
    return text
}

function make_faction_name(text: string) :string {
    text = text.toLowerCase()
    text = text.replaceAll('-', '')
    text = text.replaceAll(' ', '')
    text = text.replaceAll('of', ' of ')
    text = faction_name_first_words.reduce((text, word) => {
        return text.replace(word, word + ' ')
    }, text)
    return text
}

const faction_name_first_words: string[] = [
    'endless',
    'flesheater',
    'gloomspite',
    'idoneth',
    'kharadron',
    'lumineth',
    'megagargant',
    'ogor',
    'orruk',
    'ossiarch',
    'slaves',
    'slaves to',
    'soulblight',
    'stormcast',
]

const faction_name_typos: Record<string, string> = {
    'OR RU K WA RC L A N S': 'ORRUK WARCLANS',
    'S K AV E N': 'SKAVEN',
    'S Y LVA N E T H': 'SYLVANETH',
}

const import_bases = (path: string) => {
    console.log('Importing')
    parse_pdf(path).then(function(output: string) {
        let currentFaction: string = ''
        let potentialFactionName: string = ''
        let profiles: Record<string, Record<string, string>> = output.split('\n').reduce((accum, line) => {
            if (line.replaceAll(' ', '').startsWith('WARSCROLL')) {
                currentFaction = potentialFactionName
                if (!(currentFaction in accum)) accum[currentFaction] = {}
            }
            else {
                if (line.replaceAll(' ', '').startsWith('FACTION')) currentFaction = ''
                if (line.includes('||') && (currentFaction !== '')) {
                    let renderedLine = render_warscroll_line(line)
                    let name = renderedLine.split('||')[0].trim()
                    if (!(name in accum[currentFaction])) accum[currentFaction][name] = renderedLine
                }
            }
            if (!line.includes('||')) {
                potentialFactionName = make_faction_name(line)
            }
            return accum
        }, {} as Record<string, Record<string, string>>)
        write_text_files(profiles)
    })
}

const parse_pdf = (path: string) => {
    let dataBuffer = fs.readFileSync(path)
    let parsed = pdf(dataBuffer, options).then(function(data) {
        return data.text
    })
    return parsed
}

const warscroll_name_typos: Record<string, string> = {
    'A rch-Wa rlock': 'Arch-Warlock',
    "Hed k ra k k a's Mad mob": "Hedkrakka's Madmob",
    "K a i na n's Reapers": "Kainan's Reapers",
    'K l a q -Tr o k': 'Klaq-Trok',
    'S p i r e Ty r a nt s': 'Spire Tyrants',
    'Stea m Ta n k': 'Steam Tank',
    'Ta r a nt u los Brood': 'Tarantulos Brood',
    'Te r r o r g h e i s t': 'Terrorgheist',
    'To m b B a n s h e e': 'Tomb Banshee',
    'Tree-Revena nts': 'Tree-Revenants',
    'Ty r a nt': 'Tyrant',
    'Tzaa ngors': 'Tzaangors',
    'Va r g hei s t s': 'Vargheists',
    'Va r gs k y r': 'Vargskyr',
    'Ve r mint i d e': 'Vermintide',
    'Wa rdok k': 'Wardokk',
    'Wa r Hyd ra': 'War Hydra',
    "Z a rbag's Git z": "Zarbag's Gitz",
}

const remove_faction_prefix = (name: string) :string => {
    name = name.replace(/^Beasts of Chaos /, '')
    name = name.replace(/^Disciples of Tzeentch /, '')
    name = name.replace(/^Slaves to Darkness /, '')
    return name
}

const render_warscroll_line = (line: string) :string => {
    const parts = line.split('||')
    const name = parts.at(0) as string
    let normalisedName = name && warscroll_name_typos[name] || name
    normalisedName = remove_faction_prefix(normalisedName)
    const size = parts.at(-1)
    return (normalisedName?.padEnd(70, ' ') + ' || ' + size).trim()
}

const write_text_files = (profiles: Record<string, Record<string, string>>) => {
    const dataDirectory = path.join(__dirname, '..', '..', 'warscrolls', 'data')
    const safeFilenamePattern = new RegExp(/^[\w ]+$/);

    Object.entries(profiles).forEach(([faction, warscrolls]) => {
        if (!safeFilenamePattern.test(faction)) {
            console.error(`Faction name "${faction}" cannot be used in a filename`)
            return
        }

        let filename = toStandard(faction).replaceAll('-', '_') + '.txt'
        let data = Object.values(warscrolls).join('\n')

        fs.writeFile(path.join(dataDirectory, filename), data, err => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(`${filename} written`)
            }
        });
    })
}

import_bases('profiles.pdf')