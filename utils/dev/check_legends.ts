import path from "path"
import fs from 'fs';
import { dataDirectory } from "../env";
import { xor } from "lodash";

const compare_data = () => {
    const legendsDirectory = path.join(dataDirectory, 'legends')
    const files = [...fs.readdirSync(legendsDirectory).map(x => path.join(legendsDirectory, x)), path.join(dataDirectory, 'legends.txt')]
    let data: string[]= []
    files.forEach(filePath => {
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const fileLines = fileContents.trim().split('\n')
        data.push(...fileLines)
    })

    const mismatches = data.map(x => {
        if (data.filter(y => y === x).length < 2) return x
    })

    console.log(mismatches.filter(x => x !== undefined))
}

compare_data()