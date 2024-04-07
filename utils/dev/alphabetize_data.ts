import path from "path"
import fs from 'fs';

const dataDirectory = path.join(process.cwd(), 'data', 'aos')

const rewrite_data = () => {
    const files = fs.readdirSync(dataDirectory)
    files.forEach(filename => {
        const filePath = path.join(dataDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const lines = fileContents.trim().split('\n')
        const reordered = lines.sort()
        const data = reordered.join('\n') + '\n'

        fs.writeFile(filePath, data, err => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(`${filename} written`)
            }
        });
    })
}

rewrite_data()