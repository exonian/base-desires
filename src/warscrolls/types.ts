export type TBaseSize =
    | "25mm"
    | "32mm"
    | "40mm"
    | "50mm"
    | "60mm"
    | "65mm"
    | "80mm"
    | "100mm"
    | "130mm"
    | "160mm"
    | "170mm"
    | "60 x 35mm"
    | "75 x 42mm"
    | "90 x 52mm"
    | "105 x 70mm"
    | "120 x 92mm"
    | "170 x 105mm"
    | "280 x 210mm"
    | "Custom base"
    | "No base"

export type TWarscroll = {
    baseSize: TBaseSize
    notes?: string
}

export type TWarscrolls = Record<string, TWarscroll>