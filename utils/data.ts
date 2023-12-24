import {  TWarscrolls, TUntaggedWarscrolls, TFactionWarscrolls } from "../warscrolls/types";

export const tagWarscrolls = (warscrolls: TUntaggedWarscrolls, faction: string): TWarscrolls => {
    return Object.keys(warscrolls).reduce((accum, key) => {
        accum[key] = { ...warscrolls[key], factions: [faction]}
        return accum
    }, {} as TWarscrolls)
}

export const tagAndCombine = (factions: TFactionWarscrolls[]): TWarscrolls => {
    return factions.reduce((accum, faction: TFactionWarscrolls): TWarscrolls => {
        const taggedFactionWarscrolls = tagWarscrolls(faction.warscrolls, faction.faction)
        Object.keys(taggedFactionWarscrolls).forEach(name => {
            if (name in accum) accum[name].factions.push(faction.faction)
            else accum[name] = taggedFactionWarscrolls[name]
        })
        return accum
    }, {} as TWarscrolls)
}

export const listWarscrolls = (factions: TFactionWarscrolls[]): Record<string, string[]> => {
    return factions.reduce((accum, faction): Record<string, string[]> => {
        Object.keys(faction.warscrolls).forEach(name => {
            const match = accum[name]
            if (match) {
                accum[name] = [...match, faction.faction]
            }
            else {
                accum[name] = [faction.faction]
            }
        })
        return accum
    }, {} as Record<string, string[]>)
}