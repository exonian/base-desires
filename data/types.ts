export type TWarscroll = {
    baseSize: string
    notes?: string
    factions: string[]
    source?: 'profiles' | 'legends' | 'unlisted'
}
export type TWarscrolls = Record<string, TWarscroll>