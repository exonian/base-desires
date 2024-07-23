import path from "path";
import fs from 'fs';
import { toDisplay } from '../utils/text';
import { TWarscrolls, TSource } from './types';
import { profilesDirectory, dataDirectory } from '../utils/env';

const splitLine = (line: string): { name: string, size: string } => {
    const parts = line.split('||', 2)
    return { name: parts[0].trim(), size: parts[1].trim() }
}

const loadWarscrolls = () :TWarscrolls => {
    const directoryNames: TSource[] = ['profiles', 'legends', 'unlisted']
    let warscrolls: TWarscrolls = {}

    directoryNames.forEach(directoryName => {
        const directory = path.join(dataDirectory, directoryName)
        const files = fs.readdirSync(directory)
        return files.reduce((warscrolls, filename) => {
            const filePath = path.join(directory, filename)
            const fileContents = fs.readFileSync(filePath, 'utf8')
            const lines = fileContents.split('\n')

            const factionName = toDisplay(filename.split('.')[0].replace('_', ' '))
            return lines.reduce((warscrolls, line) => {
                if (line.length == 0) return warscrolls

                let { name, size } = splitLine(line)
                let notes = ''

                const opening_bracket_position = size.indexOf('(')
                if (opening_bracket_position > -1) {
                    notes = size.slice(opening_bracket_position).trim()
                    size = size.slice(0, opening_bracket_position).trim()
                }

                if (name in warscrolls) warscrolls[name].factions.push(factionName)
                else warscrolls[name] = { baseSize: size, notes: notes, factions: [factionName], source: directoryName }

                console.table(warscrolls[name])

                return warscrolls
            }, warscrolls as TWarscrolls)
        }, warscrolls as TWarscrolls)
    })
    return warscrolls
}

let cachedWarscrolls: TWarscrolls

export const getWarscrolls = () :TWarscrolls => {
    if (cachedWarscrolls === undefined) cachedWarscrolls = loadWarscrolls()
    return cachedWarscrolls
}