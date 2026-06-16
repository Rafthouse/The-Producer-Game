import type { GenreId, ArchetypeId } from '../types/game'

// ============================================================
// ТЕМИ
// ============================================================

export type TextTopic =
  | 'love' | 'protest' | 'alcohol' | 'drugs' | 'sex' | 'money'
  | 'politics' | 'memes' | 'everyday' | 'depression' | 'nostalgia'
  | 'absurd' | 'glory' | 'food' | 'animals'

/** Словники для кожної теми */
const TOPIC_KEYWORDS: Record<TextTopic, { words: string[]; weight: number }> = {
  love: {
    weight: 1.0,
    words: [
      'коха', 'любо', 'серце', 'почут', 'романтик', 'освідчи', 'серенад',
      'дівчи', 'хлопець', 'цілу', 'обійм', 'ніжніс', 'кохан', 'зустрі',
      'весіл', 'закоха', 'солодк', 'красун', 'милий', 'мила',
      'відносин', 'стосунк', 'розбит', 'пішла', 'покину', 'зрад',
    ],
  },
  protest: {
    weight: 1.2,
    words: [
      'протест', 'револю', 'бунт', 'повстан', 'проти', 'гнів', 'злама',
      'систем', 'свобод', 'правд', 'кривд', 'справедлив', 'боріт',
      'вста', 'бий', 'лама', 'руйн', 'знищ', 'голос', 'не згод',
    ],
  },
  alcohol: {
    weight: 1.5,
    words: [
      'буха', 'алкоголь', 'горілк', 'пив', 'самогон', 'налив', 'прокис',
      'п\'ян', 'напив', 'склянк', 'бокал', 'чарк', 'пляшк', 'свято',
      'пия', 'випи', 'хмільн', 'весе', 'тост', 'за здоров',
    ],
  },
  drugs: {
    weight: 1.2,
    words: [
      'наркоти', 'трав', 'доз', 'кайф', 'удар', 'дур', 'порош',
      'ширк', 'голк', 'нарк', 'залежн', 'спотвори', 'лаборатор',
    ],
  },
  sex: {
    weight: 0.8,
    words: [
      'секс', 'сексу', 'пристрас', 'інтим', 'ліжк', 'спокусли',
      'тіло', 'шкір', 'дотик', 'ночі з тобо', 'зваб',
    ],
  },
  money: {
    weight: 1.0,
    words: [
      'грош', 'прибут', 'дохід', 'зароб', 'кошт', 'багат', 'мільйон',
      'гонорар', 'плат', 'чек', 'цін', 'вартіс', 'бюджет', 'фінанс',
      'економ', 'дола', 'капіта', 'люкс', 'дорог',
    ],
  },
  politics: {
    weight: 1.3,
    words: [
      'політик', 'депутат', 'президент', 'парті', 'вибор', 'влада',
      'закон', 'подат', 'мерія', 'уряд', 'рад', 'держав', 'міністр',
      'голова', 'комітет', 'фракці', 'бюджетн', 'декларац', 'програм',
      'мандат', 'стрічку', 'сортир', 'суд',
    ],
  },
  memes: {
    weight: 1.0,
    words: [
      'мем', 'вірус', 'лайк', 'підпис', 'фан', 'твіттер', 'ютуб',
      'стрім', 'челендж', 'монетизу', 'алгоритм', 'нейромереж', 'бот',
      'блог', 'підвал', 'автограф', 'зарядк', 'хроп', 'чхну',
    ],
  },
  everyday: {
    weight: 0.8,
    words: [
      'дід', 'бабц', 'капус', 'огірк', 'холодильник', 'каструл',
      'сусід', 'кухн', 'город', 'погріб', 'курник', 'відро',
      'кабачок', 'корова', 'сало', 'полива', 'трактор', 'копати',
      'гопак', 'граблі', 'квіт',
    ],
  },
  depression: {
    weight: 1.0,
    words: [
      'депрес', 'сум', 'самотн', 'біль', 'провал', 'сльоз', 'розпач',
      'втом', 'пустот', 'темряв', 'туга', 'журб', 'страх', 'тривог',
      'ніч', 'дощ', 'плак', 'злама', 'дно',
    ],
  },
  nostalgia: {
    weight: 0.9,
    words: [
      'ностальг', 'спомин', 'минул', 'дитинств', 'колись', 'давно',
      'старий', 'пам\'ят', 'роки', 'молод', 'забут', 'спогад',
      'золот', 'минущ', 'час', 'плив',
    ],
  },
  absurd: {
    weight: 1.4,
    words: [
      'сюрреал', 'гом', 'яйце', 'жаб', 'тарган', 'коз', 'ведмід',
      'равлик', 'голуб', 'свин', 'тролейбу', 'ліфт', 'сусід', 'кріт',
      'сома', 'баян', 'калюж', 'ілюзі', 'капці', 'подушк', 'пельмен',
      'кабінк', 'нужник', 'фонтан', 'інсталя',
    ],
  },
  glory: {
    weight: 0.7,
    words: [
      'слав', 'зірк', 'концерт', 'фан', 'сцен', 'тур', 'альбом',
      'хіт', 'трек', 'сингл', 'кліп', 'продюсер', 'менеджер', 'шоу',
    ],
  },
  food: {
    weight: 0.8,
    words: [
      'борщ', 'холодець', 'каш', 'варен', 'гречк', 'ковбас', 'суп',
      'їж', 'смак', 'хліб', 'варени', 'м\'яс', 'молок', 'сир',
      'яблук', 'картопл', 'пельмен', 'капус', 'сал',
    ],
  },
  animals: {
    weight: 0.7,
    words: [
      'кіт', 'кот', 'собак', 'пес', 'хом\'я', 'жаб', 'голуб',
      'равлик', 'тарган', 'ведмід', 'свин', 'коров', 'коз',
      'кріт', 'сома', 'слон', 'мавп', 'зайч', 'вовк', 'лис',
      'білк', 'качк', 'кури', 'півн',
    ],
  },
}

// ============================================================
// АФІННОСТІ ЖАНРІВ до тем
// ============================================================

interface GenreAffinity {
  likes: TextTopic[]    // теми, що дають бонус
  hates: TextTopic[]    // теми, що дають штраф
}

const GENRE_AFFINITY: Record<GenreId, GenreAffinity> = {
  punk: {
    likes: ['protest', 'alcohol', 'absurd', 'politics', 'everyday'],
    hates: ['love', 'glory', 'nostalgia'],
  },
  rap: {
    likes: ['money', 'protest', 'politics', 'sex', 'glory'],
    hates: ['food', 'everyday'],
  },
  pop: {
    likes: ['love', 'sex', 'money', 'glory', 'memes'],
    hates: ['depression', 'politics', 'protest'],
  },
  folk: {
    likes: ['everyday', 'food', 'nostalgia', 'animals', 'love'],
    hates: ['memes', 'absurd', 'drugs'],
  },
  bard: {
    likes: ['nostalgia', 'depression', 'love', 'everyday', 'absurd'],
    hates: ['memes', 'glory'],
  },
  electro: {
    likes: ['absurd', 'memes', 'drugs', 'sex', 'glory'],
    hates: ['everyday', 'nostalgia', 'food'],
  },
}

// ============================================================
// АФІННОСТІ АРХЕТИПІВ до тем
// ============================================================

const ARCHETYPE_AFFINITY: Record<ArchetypeId, GenreAffinity> = {
  punk: {
    likes: ['protest', 'alcohol', 'absurd', 'politics'],
    hates: ['love', 'glory', 'nostalgia'],
  },
  workaholic: {
    likes: ['money', 'glory', 'nostalgia'],
    hates: ['alcohol', 'drugs', 'depression'],
  },
  alcoholic: {
    likes: ['alcohol', 'depression', 'absurd'],
    hates: ['love', 'glory'],
  },
  romantic: {
    likes: ['love', 'nostalgia', 'sex'],
    hates: ['protest', 'politics', 'absurd'],
  },
  lazy: {
    likes: ['everyday', 'food', 'memes'],
    hates: ['protest', 'glory'],
  },
  genius: {
    likes: ['absurd', 'memes', 'depression'],
    hates: ['alcohol', 'drugs'],
  },
  diva: {
    likes: ['love', 'glory', 'money', 'sex'],
    hates: ['everyday', 'protest'],
  },
  street: {
    likes: ['money', 'protest', 'everyday', 'alcohol'],
    hates: ['love', 'nostalgia'],
  },
}

// ============================================================
// АНАЛІЗ ТЕКСТУ
// ============================================================

export interface TextAnalysis {
  /** Бали по кожній темі (0-100) */
  topics: Record<TextTopic, number>
  /** Чи є текст достатньо довгим */
  valid: boolean
  /** Загальна «вага» тексту */
  totalWeight: number
  /** Кількість розпізнаних слів */
  matchedWords: number
}

/**
 * Аналізує текст і повертає бали по всіх темах.
 */
export function analyzeText(text: string): TextAnalysis {
  const lines = text.trim().split('\n').filter(Boolean)
  const valid = lines.length >= 4 && text.length <= 2000

  const lowercase = text.toLowerCase()
  const words = lowercase.split(/[\s,.;!?()"—«»]+/).filter(Boolean)
  const matched = new Set<string>()

  const topics: Record<string, number> = {}

  for (const [topic, dict] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0
    for (const word of words) {
      for (const kw of dict.words) {
        if (word.includes(kw)) {
          score += dict.weight
          matched.add(kw)
        }
      }
    }
    // Нормалізуємо до 0-100
    topics[topic] = Math.min(100, Math.round(score * 1.5))
  }

  return {
    topics: topics as Record<TextTopic, number>,
    valid,
    totalWeight: Object.values(topics).reduce((a, b) => a + b, 0),
    matchedWords: matched.size,
  }
}

// ============================================================
// ВІДПОВІДНІСТЬ АРТИСТУ
// ============================================================

export interface FitResult {
  /** Відповідність артисту 0-100% */
  artistFit: number
  /** Відповідність трендам Овертона 0-100% */
  trendFit: number
  /** Шанс скандалу 0-100% */
  scandalChance: number
  /** Шанс вірусності/мемності 0-100% */
  viralChance: number
  /** Кринжовість 0-100 */
  cringe: number
  /** Чи варто тексту стати мемом попри низьку відповідність */
  memePotential: number
  /** Деталізований звіт */
  details: {
    genreFit: number
    archetypeFit: number
    likes: string[]
    hates: string[]
  }
}

/**
 * Розраховує всі метрики відповідності тексту.
 */
export function calculateTextFit(
  analysis: TextAnalysis,
  genreId: GenreId,
  archetypeId: ArchetypeId,
  overtonTopics: { topic: TextTopic; popularity: number }[]
): FitResult {
  const genreAff = GENRE_AFFINITY[genreId]
  const archetypeAff = ARCHETYPE_AFFINITY[archetypeId]

  // === Відповідність жанру ===
  let genreScore = 0
  let genreMax = 0
  const likesList: string[] = []
  const hatesList: string[] = []

  for (const topic of genreAff.likes) {
    genreMax += 100
    genreScore += analysis.topics[topic]
    if (analysis.topics[topic] > 20) likesList.push(topic)
  }
  for (const topic of genreAff.hates) {
    genreMax += 50
    genreScore += 50 - analysis.topics[topic] // штраф: чим більше hate-теми, тим гірше
    if (analysis.topics[topic] > 20) hatesList.push(topic)
  }
  const genreFit = genreMax > 0 ? Math.round((genreScore / genreMax) * 100) : 50

  // === Відповідність архетипу ===
  let archScore = 0
  let archMax = 0
  for (const topic of archetypeAff.likes) {
    archMax += 100
    archScore += analysis.topics[topic]
  }
  for (const topic of archetypeAff.hates) {
    archMax += 50
    archScore += 50 - analysis.topics[topic]
  }
  const archetypeFit = archMax > 0 ? Math.round((archScore / archMax) * 100) : 50

  // === Загальна відповідність артисту ===
  const artistFit = Math.round((genreFit + archetypeFit) / 2)

  // === Відповідність трендам Овертона ===
  let trendScore = 0
  let trendMax = 0
  for (const ot of overtonTopics) {
    trendMax += 100
    const topicScore = analysis.topics[ot.topic as TextTopic] ?? 0
    // Якщо тема популярна (>50) — бонус за співпадіння
    // Якщо непопулярна — штраф за співпадіння
    if (ot.popularity > 50) {
      trendScore += topicScore * (ot.popularity / 100)
    } else {
      trendScore += topicScore * (1 - ot.popularity / 100) * 0.3 // small penalty
    }
  }
  const trendFit = trendMax > 0 ? Math.round((trendScore / trendMax) * 100) : 50

  // === Шанс скандалу ===
  const scandalTopics = ['drugs', 'politics', 'sex', 'alcohol']
  const scandalRaw = scandalTopics.reduce((s, t) => s + (analysis.topics[t as TextTopic] ?? 0), 0)
  const scandalChance = Math.min(90, Math.round(scandalRaw / 4))

  // === Кринж (+ абсурд + меми + алкоголь) ===
  const cringe = Math.min(100, Math.round(
    (analysis.topics.absurd * 0.4 +
     analysis.topics.memes * 0.3 +
     analysis.topics.everyday * 0.2 +
     analysis.topics.food * 0.2 +
     analysis.topics.alcohol * 0.15)
  ))

  // === Вірусність/мемність ===
  const viralBase = cringe > 60 ? cringe * 0.6 : 0
  const absurdBonus = analysis.topics.absurd > 50 ? 20 : 0
  const memeBonus = analysis.topics.memes > 40 ? 15 : 0
  const viralChance = Math.min(95, Math.round(viralBase + absurdBonus + memeBonus))

  // === Мем-потенціал (коли пісня погана, але смішна) ===
  // Якщо відповідність низька (<30), але кринж високий — стає хітом
  const memePotential = artistFit < 30 && cringe > 60
    ? Math.min(100, Math.round(cringe * 1.2 + (50 - artistFit)))
    : 0

  return {
    artistFit,
    trendFit,
    scandalChance,
    viralChance,
    cringe,
    memePotential,
    details: { genreFit, archetypeFit, likes: likesList, hates: hatesList },
  }
}

/**
 * Застосовує аналіз тексту до формули релізу.
 * Повертає модифікатори для calculateRelease.
 */
export function getTextModifiers(
  artistGenre: GenreId,
  artistArchetype: ArchetypeId,
  overtonTopics: { topic: TextTopic; popularity: number }[],
  analysis: TextAnalysis
): { textFitBonus: number; cringeBonus: number; scandalPenalty: number; viralExtra: number } {
  const fit = calculateTextFit(analysis, artistGenre, artistArchetype, overtonTopics)

  // Бонус від відповідності: 0-100 → -10 до +15
  const textFitBonus = Math.round((fit.artistFit - 50) * 0.3)

  // Мем-бонус: якщо кринж високий + мем-потенціал спрацював
  const cringeBonus = fit.memePotential > 0 ? Math.round(fit.memePotential * 0.25) : 0

  // Скандал-штраф
  const scandalPenalty = -Math.round(fit.scandalChance * 0.1)

  // Віральний бонус (для популярності)
  const viralExtra = fit.viralChance > 50 ? fit.viralChance : 0

  return { textFitBonus, cringeBonus, scandalPenalty, viralExtra }
}

/** Назви тем українською */
export const TOPIC_LABELS: Record<TextTopic, string> = {
  love: 'Любов',
  protest: 'Протест',
  alcohol: 'Алкоголь',
  drugs: 'Наркотики',
  sex: 'Секс',
  money: 'Гроші',
  politics: 'Політика',
  memes: 'Меми',
  everyday: 'Побут',
  depression: 'Депресія',
  nostalgia: 'Ностальгія',
  absurd: 'Абсурд',
  glory: 'Слава',
  food: 'Їжа',
  animals: 'Тварини',
}
