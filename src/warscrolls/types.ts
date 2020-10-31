export type TBaseSize =
    | "25mm"
    | "32mm"
    | "40mm"
    | "50mm"
    | "60mm"
    | "65mm"
    | "100mm"
    | "60 x 35mm"
    | "75 x 42mm"
    | "90 x 52mm"
    | "170 x 105mm"

export type TWarscroll = {
    baseSize: TBaseSize
    notes?: string
}

export type TWarscrolls = Record<string, TWarscroll>