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
        let lastX: number = 0, lastWidth:number = 0, lastHeight:number = 0, text:string = '';
        for (let item of textContent.items) {
            let currentX = item.transform[4]
            if (currentX <= lastX - 100 || Math.abs(item.height - lastHeight) > 1){
                text += '\n' + item.str;
            }
            else {
                if (currentX > lastX + lastWidth + 10) {
                    text += '||' + item.str;
                }
                else {
                    text += item.str;
                }
            }    
            lastX = item.transform[4];
            lastWidth = item.width;
            lastHeight = item.height;
        }
        return text;
    });
}

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
        let profiles: Record<string, string[]> = output.split('\n').reduce((accum, line) => {
            if (line.startsWith('WA R S C ROL L')) {
                currentFaction = potentialFactionName
                accum[currentFaction] = []
            }
            else {
                if (line.startsWith('FACTION')) currentFaction = ''
                if (line.includes('||') && (currentFaction !== '')) {
                    const parts = line.split('||')
                    const unit_and_size = parts.at(0) + ' || ' + parts.at(-1)
                    accum[currentFaction].push(unit_and_size)
                }
            }
            if (!line.includes('||')) potentialFactionName = faction_name_typos[line] || line
            return accum
        }, {} as Record<string, string[]>)
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

const write_text_files = (profiles: Record<string, string[]>) => {
    const dataDirectory = path.join(__dirname, '..', '..', 'warscrolls', 'new_text_data')
    const safeFilenamePattern = new RegExp(/^[\w -]+$/);

    Object.entries(profiles).forEach(([faction, warscrolls]) => {
        if (!safeFilenamePattern.test(faction)) {
            console.error(`Faction name "${faction}" cannot be used in a filename`)
            return
        }

        let filename = toStandard(faction) + '.txt'
        let data = warscrolls.join(' \n')

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