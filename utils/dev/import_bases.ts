import fs from 'fs';
import pdf  from 'pdf-parse';


let options = {
    pagerender: render_page
}

function render_page(pageData) {
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }
 
    return pageData.getTextContent(render_options)
    .then(function(textContent) {
        let lastX, lastWidth, text = '';
        for (let item of textContent.items) {
            let currentX = item.transform[4]
            if (currentX <= lastX || !lastX){
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
        }
        return text;
    });
}

const import_bases = (path: string) => {
    console.log('Importing')
    parse_pdf(path)
}

const parse_pdf = (path: string) => {
    let dataBuffer = fs.readFileSync(path)
    pdf(dataBuffer, options).then(function(data) {
        console.log(data.text);
    })
}

import_bases('profiles.pdf')