export type TBaseSize = "25mm" | "32mm" | "40mm"
                      | "60 x 35mm" | "170 x 105mm"

export type TWarscroll = {
    baseSize: TBaseSize
    notes?: string
}

export type TWarscrolls = Record<string, TWarscroll>