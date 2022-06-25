import { startCase, camelCase } from "lodash";

export const toDisplay = (val: string): string => startCase(camelCase(val))

export const toStandard = (val: string): string => val.toLowerCase().split(' ').join('-')

export const withoutHyphens = (val: string): string => val.split('-').join(' ')