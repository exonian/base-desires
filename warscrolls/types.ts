export type TUntaggedWarscroll = {
    baseSize: string
    notes?: string
}
export type TUntaggedWarscrolls = Record<string, TUntaggedWarscroll>
export type TFactionWarscrolls = {
    faction: string
    warscrolls: TUntaggedWarscrolls
}

export type TWarscroll = TUntaggedWarscroll & {
    factions: string[]
}
export type TWarscrolls = Record<string, TWarscroll>