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

export const game = process.env.NEXT_PUBLIC_GAME
const gameDirectory = game === 'tow' ? 'tow' : 'aos'
export const dataDirectory = path.join(process.cwd(), 'data', gameDirectory)
export const profilesDirectory = path.join(dataDirectory, 'profiles')
export const siteName = game === 'tow' ? 'Base Desires²' : 'Base Desires'

export const aosSources :any = {
    'profiles': 'Battle Profiles April (End) 2025',
    'legends': 'Legends April (End) 2025',
    'unlisted': 'Unlisted',
    'corrected': 'Corrected',
    'fan-made': 'Fan-made faction',
}