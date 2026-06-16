import type { ArtistEvent } from '../types/game'
import { randInt, chance } from '../lib/random'

/** Шаблон події з метаданими для генерації */
interface EventTemplate {
  title: string
  description: string
  emoji: string
  /** Функція, що повертає ефекти (щоб randInt працював при генерації, а не при створенні масиву) */
  getEffects: () => Record<string, number>
  minAddiction: number
  maxAddiction: number
  minHappiness: number
  maxHappiness: number
  weight: number
  royaltyDemand?: boolean
}

const EVENT_TEMPLATES: EventTemplate[] = [
  // Здоров'я
  {
    title: 'Захворів',
    description: 'Підхопив вірус на гастролях. Потрібен тиждень відпочинку.',
    emoji: '🤒',
    getEffects: () => ({ health: -randInt(8, 15), happiness: -randInt(3, 8) }),
    minAddiction: 0, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 8,
  },
  {
    title: 'Травмувався на сцені',
    description: 'Невдалий стрибок у натовп. Тепер спина болить.',
    emoji: '🩼',
    getEffects: () => ({ health: -randInt(12, 20), happiness: -randInt(5, 10), discipline: -2 }),
    minAddiction: 0, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 4,
  },
  {
    title: 'Пішов у спортзал',
    description: 'Вирішив взяти себе в руки. Навіть купив абонемент.',
    emoji: '💪',
    getEffects: () => ({ health: randInt(5, 10), discipline: randInt(2, 5) }),
    minAddiction: 0, maxAddiction: 50,
    minHappiness: 0, maxHappiness: 100,
    weight: 5,
  },

  // Щастя
  {
    title: 'Закохався',
    description: 'Нові почуття! Весь тиждень літає в хмарах.',
    emoji: '💕',
    getEffects: () => ({ happiness: randInt(8, 15), discipline: -randInt(3, 7), charisma: randInt(2, 4) }),
    minAddiction: 0, maxAddiction: 60,
    minHappiness: 20, maxHappiness: 90,
    weight: 6,
  },
  {
    title: 'Посварився з коханою',
    description: 'Драма в особистому житті. Все погано, музика — єдина втіха.',
    emoji: '💔',
    getEffects: () => ({ happiness: -randInt(10, 18), charisma: -randInt(2, 4), talent: randInt(2, 5) }),
    minAddiction: 0, maxAddiction: 70,
    minHappiness: 0, maxHappiness: 100,
    weight: 5,
  },
  {
    title: 'Купив нову машину',
    description: 'Tesla Cybertruck у рожевому кольорі. Навіщо? Не питайте.',
    emoji: '🚗',
    getEffects: () => ({ happiness: randInt(5, 10), popularity: randInt(1, 3), discipline: -2 }),
    minAddiction: 0, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 4,
  },

  // Залежність
  {
    title: 'Почав бухати',
    description: 'Щоденні вечірки — це весело, але організм не витримує.',
    emoji: '🍾',
    getEffects: () => ({ addiction: randInt(8, 15), health: -randInt(3, 8), happiness: randInt(3, 6) }),
    minAddiction: 0, maxAddiction: 60,
    minHappiness: 10, maxHappiness: 100,
    weight: 7,
  },
  {
    title: 'Кинув бухати',
    description: 'Усвідомив проблему. Тверезість — новий тренд!',
    emoji: '🧃',
    getEffects: () => ({ addiction: -randInt(10, 20), health: randInt(3, 7), discipline: randInt(3, 6) }),
    minAddiction: 30, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 6,
  },
  {
    title: 'Спробував наркотики',
    description: 'Погані друзі, погані рішення. Це не закінчиться добре.',
    emoji: '💉',
    getEffects: () => ({ addiction: randInt(12, 20), health: -randInt(5, 10), discipline: -randInt(3, 6) }),
    minAddiction: 0, maxAddiction: 50,
    minHappiness: 20, maxHappiness: 100,
    weight: 4,
  },
  {
    title: 'Пішов на реабілітацію самостійно',
    description: 'Молодець. Сам захотів — сам пішов. Ще тиждень тверезості.',
    emoji: '🙏',
    getEffects: () => ({ addiction: -randInt(5, 12), health: randInt(2, 5), discipline: randInt(2, 4) }),
    minAddiction: 50, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 3,
  },

  // Кар'єра
  {
    title: 'Втомився',
    description: 'Виснаження. Хоче просто лежати і нічого не робити.',
    emoji: '😴',
    getEffects: () => ({ discipline: -randInt(5, 10), happiness: -randInt(3, 6), health: -randInt(2, 4) }),
    minAddiction: 0, maxAddiction: 80,
    minHappiness: 0, maxHappiness: 100,
    weight: 8,
  },
  {
    title: 'Просить підвищення',
    description: 'Вважає, що заслуговує більшого. Потрібно його мотивувати.',
    emoji: '💸',
    getEffects: () => ({ discipline: -randInt(3, 7), happiness: -randInt(2, 5) }),
    minAddiction: 0, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 6,
    royaltyDemand: true,
  },
  {
    title: 'Написав хіт уві сні',
    description: 'Прокинувся о 3 ранку, записав демку. Це геніально.',
    emoji: '🌙',
    getEffects: () => ({ talent: randInt(3, 7), popularity: randInt(2, 4), happiness: randInt(3, 5) }),
    minAddiction: 0, maxAddiction: 70,
    minHappiness: 0, maxHappiness: 100,
    weight: 4,
  },
  {
    title: 'Посварився з колегою',
    description: 'Конфлікт у студії. Напружена атмосфера весь тиждень.',
    emoji: '😤',
    getEffects: () => ({ happiness: -randInt(5, 10), discipline: -randInt(2, 5), charisma: -randInt(1, 3) }),
    minAddiction: 0, maxAddiction: 70,
    minHappiness: 0, maxHappiness: 100,
    weight: 5,
  },
  {
    title: 'Зник на три дні',
    description: 'Ніхто не знає де він. Повернувся з новим тату і піснею.',
    emoji: '🗿',
    getEffects: () => ({ discipline: -randInt(5, 10), talent: randInt(2, 4), popularity: randInt(1, 3) }),
    minAddiction: 0, maxAddiction: 80,
    minHappiness: 0, maxHappiness: 100,
    weight: 3,
  },

  // Популярність
  {
    title: 'Дав скандальне інтерв\'ю',
    description: 'Наробив шуму в пресі. Хай там як, про нього говорять.',
    emoji: '📺',
    getEffects: () => ({ popularity: randInt(4, 8) }),
    minAddiction: 0, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 5,
  },
  {
    title: 'Зробив дурний танцювальний челендж',
    description: 'Відео набрало мільйони переглядів. Так тримати!',
    emoji: '🕺',
    getEffects: () => ({ popularity: randInt(3, 6), happiness: randInt(2, 4) }),
    minAddiction: 0, maxAddiction: 100,
    minHappiness: 0, maxHappiness: 100,
    weight: 5,
  },
]

/** Генерує випадкову подію для артиста на цей тиждень */
export function generateArtistEvent(
  addiction: number,
  happiness: number,
): ArtistEvent | null {
  if (!chance(0.45)) return null

  const eligible = EVENT_TEMPLATES.filter(
    (t) => addiction >= t.minAddiction && addiction <= t.maxAddiction
      && happiness >= t.minHappiness && happiness <= t.maxHappiness
  )

  if (eligible.length === 0) return null

  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0)
  let roll = Math.random() * totalWeight
  for (const ev of eligible) {
    roll -= ev.weight
    if (roll <= 0) {
      const effects = ev.getEffects()
      return {
        id: `${ev.title.toLowerCase().replace(/[\s']+/g, '_')}_${Date.now()}`,
        title: ev.title,
        description: ev.description,
        emoji: ev.emoji,
        effects,
        royaltyDemand: ev.royaltyDemand ?? false,
      }
    }
  }

  return null
}

/** Набір можливих подій для довідки (використовується в UI) */
export const ALL_ARTIST_EVENTS = EVENT_TEMPLATES.map((t) => ({
  title: t.title,
  description: t.description,
  emoji: t.emoji,
}))
