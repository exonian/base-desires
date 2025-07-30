import fs from 'fs';
import path from 'path';
import PdfParse from 'pdf-parse';
import pdf  from 'pdf-parse';
import { game, profilesDirectory, dataDirectory } from '../env';
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
            if (currentX < lastX - 160 || Math.abs(item.height - lastHeight) > 1.5 || currentY > lastY + 100) {
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
        text = text.replaceAll("  ", " ");
        return text;
    });
}


function clean_text(text: string) :string {
    text = text.replace(/\s+/g,' ')  // nbsps, which interfere with searching, and extraneous spaces
    text = text.replaceAll("×", "x")  // for searching
    text = text.replaceAll("’", "'")  // for searching
    text = text.replaceAll("�", ".")  // for display and search
    text = text.replace(/(\w)/g, "$1th")  // weird th. In word, so lowercase
    text = text.replaceAll("", "Th")  // weird Th otherwise
    text = text.replaceAll("", "fi")  // weird character
    text = text.replaceAll("", "ff")  // weird character
    text = text.replaceAll("", "ffl")  // weird character
    text = text.replaceAll("", "fl")  // weird character
    text = text.replaceAll("", "ft")  // weird character
    text = text.replaceAll("", "-")  // weird character
    text = text.replaceAll("✹", "")  // star character indicating change
    text = text.replaceAll(String.fromCharCode(7), "")  // invisible control character

    text = text.replace(/(\d)? {0,1}(\d) {0,1}m {0,1}m/g, "$1$2mm")  // remove spaces in simple sizes
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

const alt_profile_prefixes: string[] = [
    'Scourge of Ghyran',
]

const import_bases_aos = (path: string) => {
    console.log('Importing aos bases')
    parse_pdf(path).then(function(output: string) {
        let currentFaction: string = ''
        let potentialFactionLine: string = ''
        let profiles: Record<string, Record<string, string>> = {}
        let inLegends: boolean = false
        let legends: Record<string, string> = {}
        let inEnhancements: boolean = false

        output.split('\n').every(line => {
            const lineNoSpaces = line.replaceAll(' ', '')
            // Break out of the loop if we encounter ADDENDA
            // (ie we're not still on the contents page)
            if (lineNoSpaces.startsWith('ADDENDA')) return false

            // Detect when we reach an enhancements points table
            if (lineNoSpaces.startsWith('TYPE')) inEnhancements = true

            // Skip this line if it's blank
            if (line.trim().length == 0) return true

            // Skip this line if it's an alternative profile per Scourge of Ghyran etc
            let profileIsAlt = false
            alt_profile_prefixes.forEach(prefix => {
                if (lineNoSpaces.startsWith(prefix.replaceAll(' ', ''))) profileIsAlt = true
            })
            if (profileIsAlt) return true

            // Skip this line if it's the "new" or "updated" badges
            if (lineNoSpaces.startsWith('UPDATED') || lineNoSpaces.startsWith('NEW')) return true

            // Detect we're into Legends
            if (Object.keys(profiles).length > 0 && lineNoSpaces.startsWith('WARHAMMERLEGENDS')) {
                inLegends = true
                inEnhancements = false
            }

            // Make note of every line that isn't in a table as potentially the next faction name
            if (!line.includes('||')) {
                potentialFactionLine = line
                currentFaction = ''
            }

            // Detect the start of a table, so set the faction name and add it to profiles dict if needed
            if (lineNoSpaces.startsWith('HEROES') || lineNoSpaces.startsWith('UNITS')) {
                inEnhancements = false
                currentFaction = make_faction_name(potentialFactionLine)
                if (!(currentFaction in profiles)) profiles[currentFaction] = {}
            }
            else {
                // Skip the line if we're in an enhancements table
                if (inEnhancements) return true

                // Otherwise, detect a table line that isn't the headers and parse it as a unit
                if (line.includes('||') && (currentFaction !== '' || inLegends == true)) {
                    let renderedLine = render_warscroll_line(line)
                    let name = renderedLine.split('||')[0].trim()
                    if (name.length == 0) return true
                    if (inLegends == true) {
                        if (!lineNoSpaces.startsWith('LEGENDS')) legends[name] = renderedLine
                    }
                    else {
                        if (!(name in profiles[currentFaction]) && !ignore_profile(name)) {
                            profiles[currentFaction][name] = renderedLine
                        }
                    }
                }
            }
            // Return true to keep the loop going
            return true
        })
        write_text_files(profiles, legends)
    })
}

const import_bases_40k = (path: string) => {
    console.log('Importing 40k bases')
    parse_pdf(path).then(function(output: string) {
        let currentFaction: string = ''
        let potentialFactionLine: string = ''
        let profiles: Record<string, Record<string, string>> = {}
        let inBaseSizes: boolean = false

        output.split('\n').every(line => {
            const lineNoSpaces = line.replaceAll(' ', '')

            // Detect once we reach the Base Size Guide
            if (line.trim() === 'BASE SIZE GUIDE') inBaseSizes = true

            // Skip this line if we haven't reached the Base Size Guide yet
            if (!inBaseSizes) return true

            // Skip this line if it's blank or only a couple of characters
            if (line.trim().length < 3) return true

            // Detect we're into Imperial Armour for the current faction
            if (Object.keys(profiles).length > 0 && lineNoSpaces.startsWith('IMPERIALARMOUR')) {
                currentFaction = currentFaction + ' imperial armour'
                if (!(currentFaction in profiles)) profiles[currentFaction] = {}
            }

            // Detect we're into Daemons for the current faction
            if (Object.keys(profiles).length > 0 && lineNoSpaces.startsWith('DAEMONS')) {
                currentFaction = currentFaction + ' daemons'
                if (!(currentFaction in profiles)) profiles[currentFaction] = {}
            }

            // Make note of every line that isn't in a table as potentially the next faction name
            if (!line.includes('||') && !lineNoSpaces.startsWith('IMPERIALARMOUR') && !lineNoSpaces.startsWith('DAEMONS')) {
                potentialFactionLine = line
                currentFaction = ''
            }

            // Detect the start of a table, so set the faction name and add it to profiles dict if needed
            // Unset inImperialArmour
            if (line.trim().startsWith('UNIT||BASE SIZE')) {
                currentFaction = potentialFactionLine.toLowerCase().replace("'", 'apostrophe')
                if (!(currentFaction in profiles)) profiles[currentFaction] = {}
            }
            else {
                // Detect a table line that isn't the headers and parse it as a unit
                if (line.includes('||') && (currentFaction !== '' )) {
                    let renderedLine = render_warscroll_line(line)
                    let name = renderedLine.split('||')[0].trim()
                    if (!(name in profiles[currentFaction]) && !ignore_profile(name)) {
                        profiles[currentFaction][name] = renderedLine
                    }
                }
            }
            // Return true to keep the loop going
            return true
        })
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

const n_models_regex: RegExp = new RegExp(/\(\d models?\)/)

const ignore_profile = (name: string) :boolean => {
    return n_models_regex.test(name)
}

const warscroll_name_typos: Record<string, string> = {
    'A rch-Wa rlock': 'Arch-Warlock',
    'Darkoath Chieftain on Wa rsteed': 'Darkoath Chieftain on Warsteed',
    'Frazzlegit Shaman on Wa r-W heela': 'Frazzlegit Shaman on War-Wheela',
    "Hed k ra k k a's Mad mob": "Hedkrakka's Madmob",
    "K a i na n's Reapers": "Kainan's Reapers",
    "Killaboss on Corpse-rippa Vu lcha": "Killaboss on Corpse-rippa Vulcha",
    'K l a q -Tr o k': 'Klaq-Trok',
    'L o r d -Te r m i n o s': 'Lord-Terminos',
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
    'Wa rcha nter': 'Warchanter',
    'Wa rdok k': 'Wardokk',
    'Wa r Hyd ra': 'War Hydra',
    "Z a rbag's Git z": "Zarbag's Gitz",
}

const render_warscroll_line = (line: string) :string => {
    const cleanedLine = line.replaceAll('✹', '').trim()
    const parts = cleanedLine.split('||')
    const name = parts.at(0) as string
    let normalisedName = name && warscroll_name_typos[name] || name
    const size = parts.at(-1)
    return (normalisedName?.padEnd(70, ' ') + ' || ' + size).trim()
}

const write_text_files = (profiles: Record<string, Record<string, string>>, legends?: Record<string, string>) => {
    const safeFilenamePattern = new RegExp(/^[\w ]+$/);

    Object.entries(profiles).forEach(([faction, warscrolls]) => {
        if (!safeFilenamePattern.test(faction)) {
            console.error(`Faction name "${faction}" cannot be used in a filename`)
            return
        }

        let filename = toStandard(faction).replaceAll('-', '_') + '.txt'
        let data = Object.values(warscrolls).join('\n') + '\n'

        fs.writeFile(path.join(profilesDirectory, filename), data, err => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(`${filename} written`)
            }
        });
    })

    if (legends) {
        let legendsData = Object.values(legends).join('\n') + '\n'
        fs.writeFile(path.join(dataDirectory, 'legends.txt'), legendsData, err => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('Legends written')
            }
        })
    }
}

if (game === 'aos') import_bases_aos('profiles.pdf')
else if (game === '40k') import_bases_40k('40k.pdf')
else console.log('Cannot import for ' + game)