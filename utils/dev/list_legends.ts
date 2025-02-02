import path from "path"
import fs from 'fs';
import { dataDirectory } from "../env";

const output_data = () => {
    const legendsDirectory = path.join(dataDirectory, 'legends')
    const files = fs.readdirSync(legendsDirectory)
    files.forEach(filename => {
        const filePath = path.join(legendsDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        console.log(filename)
        console.log(fileContents)
    })
}

output_data()