export type TSource = "profiles" | "legends" | "unlisted" | "fan-made"
export type TWarscroll = {
    baseSize: string
    notes?: string
    factions: string[]
    source: TSource
}
export type TWarscrolls = Record<string, TWarscroll>