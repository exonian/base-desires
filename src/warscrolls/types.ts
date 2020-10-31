export type TBaseSize = "25mm" | "32mm" | "40mm" | "170 x 105mm"

export type TWarscroll = {
    baseSize: TBaseSize
}

export type TWarscrolls = Record<string, TWarscroll>