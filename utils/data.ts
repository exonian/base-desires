import {  TWarscrolls, TUntaggedWarscrolls, TFactionWarscrolls } from "../warscrolls/types";

export const tagWarscrolls = (warscrolls: TUntaggedWarscrolls, faction: string): TWarscrolls => {
    return Object.keys(warscrolls).reduce((accum, key) => {
        accum[key] = { ...warscrolls[key], faction: faction}
        return accum
    }, {} as TWarscrolls)
}

export const tagAndCombine = (factions: TFactionWarscrolls[]): TWarscrolls => {
    return factions.reduce((accum, faction: TFactionWarscrolls): TWarscrolls => {
        const taggedWarscrolls = tagWarscrolls(faction.warscrolls, faction.faction)
        return { ...accum, ...taggedWarscrolls }
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