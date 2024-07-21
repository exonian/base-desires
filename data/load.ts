import path from "path";
import fs from 'fs';
import { toDisplay } from '../utils/text';
import { TWarscrolls } from "./types";
import { dataDirectory } from "../utils/env";

const splitLine = (line: string): { name: string, size: string } => {
    const parts = line.split('||', 2)
    return { name: parts[0].trim(), size: parts[1].trim() }
}

const loadWarscrolls = () :TWarscrolls => {
    const files = fs.readdirSync(dataDirectory)
    return files.reduce((accum, filename) => {
        const filePath = path.join(dataDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const lines = fileContents.split('\n')

        const factionName = toDisplay(filename.split('.')[0].replace('_', ' '))
        let legends = false
        return lines.reduce((accum, line) => {
            if (line.length == 0) return accum
            if (line == "LEGENDS") {
                legends = true
                return accum
            }

            let { name, size } = splitLine(line)
            let notes = ''

            const opening_bracket_position = size.indexOf('(')
            if (opening_bracket_position > -1) {
                notes = size.slice(opening_bracket_position).trim()
                size = size.slice(0, opening_bracket_position).trim()
            }

            if (name in accum) accum[name].factions.push(factionName)
            else accum[name] = { baseSize: size, notes: notes, factions: [factionName] }
            if (legends) accum[name].factions.push("Legends")

            console.table(accum[name])

            return accum
        }, accum as TWarscrolls)
    }, {} as TWarscrolls)
}

let cachedWarscrolls: TWarscrolls

export const getWarscrolls = () :TWarscrolls => {
    if (cachedWarscrolls === undefined) cachedWarscrolls = loadWarscrolls()
    return cachedWarscrolls
}