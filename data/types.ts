export type TWarscroll = {
    baseSize: string
    notes?: string
    factions: string[]
    source: string
}
export type TWarscrolls = Record<string, TWarscroll>