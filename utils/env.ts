import path from "path"

/**
 * There is a special built-in environment variable called NODE_ENV.
 *
 * When you run `yarn start`, it is always equal to 'development',
 * when you run `yarn test` it is always equal to 'test',
 * and when you run `yarn build` to make a production bundle,
 * it is always equal to 'production'.
 *
 * You cannot override NODE_ENV manually.
 */
export const isDev = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const isProd = process.env.NODE_ENV === 'production'

const gameFromEnv = process.env.NEXT_PUBLIC_GAME

let gameDirectory: string
export let siteName: string, game: string, gameNameHuman: string

switch (gameFromEnv) {
    case 'tow': {
        game = 'tow'
        gameDirectory = 'tow'
        gameNameHuman = 'TOW'
        siteName = 'Base Desires²'
        break
    }
    case '40k': {
        game = '40k'
        gameDirectory = '40k'
        gameNameHuman = '40k'
        siteName = 'Space Desires'
        break
    }
    default: {
        game = 'aos'
        gameDirectory = 'aos'
        gameNameHuman = 'AoS'
        siteName = 'Base Desires'
    }
}
export const dataDirectory = path.join(process.cwd(), 'data', gameDirectory)
export const profilesDirectory = path.join(dataDirectory, 'profiles')

export const aosSources :any = {
    'profiles': 'Battle Profiles December 2025',
    'legends': 'Legends December 2025',
    'unlisted': 'Unlisted',
    'corrected': 'Unofficial correction',
}

export const fortykSources :any = {
    'profiles': 'Tournament Companion July 2025',
    'unlisted': 'Unlisted',
    'corrected': 'Unofficial correction',
}