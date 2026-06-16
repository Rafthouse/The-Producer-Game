import { LINES } from '../data/lyrics'
import { TITLES } from '../data/titles'
import { pick, pickMany } from './random'

/** Генерує короткий «куплет» із 4 випадкових абсурдних рядків. */
export const generateLyrics = (): string => pickMany(LINES, 4).join('\n')

/** Випадкова назва треку. */
export const generateTitle = (): string => pick(TITLES)
