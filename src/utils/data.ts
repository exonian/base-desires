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