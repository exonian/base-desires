import fs from 'fs';
import PdfParse from 'pdf-parse';
import pdf  from 'pdf-parse';


let options: PdfParse.Options = {
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
            if (!line.includes('||')) potentialFactionName = line
            return accum
        }, {} as Record<string, string[]>)
        console.log(profiles)
    })
}

const parse_pdf = (path: string) => {
    let dataBuffer = fs.readFileSync(path)
    let parsed = pdf(dataBuffer, options).then(function(data) {
        return data.text
    })
    return parsed
}

import_bases('profiles.pdf')