import path from "path";
import fs from 'fs';
import { toDisplay } from '../utils/text';
import { TWarscrolls } from './types';
import { dataDirectory } from '../utils/env';

const splitLine = (line: string): { name: string, size: string } => {
    const parts = line.split('||', 2)
    return { name: parts[0].trim(), size: parts[1].trim() }
}

const loadWarscrolls = () :TWarscrolls => {
    const directoryNames: string[] = ['profiles', 'legends', 'unlisted', 'corrected', 'fan-made']
    let warscrolls: TWarscrolls = {}

    directoryNames.forEach(directoryName => {
        const directory = path.join(dataDirectory, directoryName)
        let files = []
        try { files = fs.readdirSync(directory) }
        catch(ENOENT) { return }

        return files.reduce((warscrolls, filename) => {
            const filePath = path.join(directory, filename)
            const fileContents = fs.readFileSync(filePath, 'utf8')
            const lines = fileContents.split('\n')

            const factionName = toDisplay(filename.split('.')[0].replace('_', ' '))
            return lines.reduce((warscrolls, line) => {
                if (line.length == 0) return warscrolls

                let { name, size } = splitLine(line)
                let source_override = ''
                let notes = ''

                const opening_curly_brace_position = size.indexOf('{')
                const closing_curly_brace_position = size.indexOf('}')
                if (opening_curly_brace_position > -1) {
                    source_override = size.slice(opening_curly_brace_position + 1, closing_curly_brace_position).trim()
                    size = size.slice(0, opening_curly_brace_position).trim()
                }

                const opening_bracket_position = size.indexOf('(')
                const closing_bracket_position = size.indexOf(')')
                if (opening_bracket_position > -1) {
                    notes = size.slice(opening_bracket_position, closing_bracket_position + 1).trim()
                    size = size.slice(0, opening_bracket_position).trim()
                }

                if (name in warscrolls) warscrolls[name].factions.push(factionName)

                else {
                    const source = source_override.length > 0 ? source_override : directoryName
                    warscrolls[name] = { baseSize: size, notes: notes, factions: [factionName], source: source }
                }

                // console.table(warscrolls[name])

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