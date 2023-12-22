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
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY){
                text += '||' + item.str;
            }  
            else{
                text += '\n' + item.str;
            }    
            lastY = item.transform[5];
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