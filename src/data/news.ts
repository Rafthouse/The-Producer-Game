import type { NewsItem, Trend } from '../types/game'
import { pick, pickMany, uid } from '../lib/random'

// Шаблони новин
const TREND_NEWS_TEMPLATES: ((trend: Trend) => { title: string; description: string; emoji: string })[] = [
  (t) => ({
    title: `Попит на "${t.name}" різко ${t.direction === 'rising' ? 'зростає' : t.direction === 'falling' ? 'падає' : 'стабілізувався'}`,
    description: `Музичні критики відзначають ${t.direction === 'rising' ? 'новий сплеск інтересу' : 'спад популярності'} до теми "${t.name}".`,
    emoji: t.emoji,
  }),
  (t) => ({
    title: `Тема "${t.name}" у тренді!`,
    description: `Слухачі активно шукають музику на тему "${t.name}". ${t.direction === 'rising' ? 'Хвиля тільки починається!' : 'Пік вже позаду.'}`,
    emoji: t.emoji,
  }),
]

const WORLD_EVENTS: { title: string; description: string; emoji: string }[] = [
  { title: 'Економічна криза', description: 'Ціни на студійне обладнання зросли. Бюджети доведеться переглянути.', emoji: '📉' },
  { title: 'Міжнародний фестиваль', description: 'Відкрито заявки на участь у найбільшому музичному фестивалі року.', emoji: '🎪' },
  { title: 'Технологічний прорив', description: 'Новий AI-інструмент для зведення музики вийшов на ринок.', emoji: '🤖' },
  { title: 'Музична премія', description: 'Оголошено номінантів на щорічну музичну премію.', emoji: '🏆' },
  { title: 'Закон про авторські права', description: 'Новий закон посилює захист авторських прав у музичній індустрії.', emoji: '📜' },
  { title: 'Пандемія грипу', description: 'Через епідемію грипу багато концертів скасовують.', emoji: '🤧' },
  { title: 'Благодійний концерт', description: 'Організовується масштабний благодійний концерт за участі зірок.', emoji: '❤️' },
  { title: 'Скандал у музичній індустрії', description: 'Відомий продюсер звинувачений у плагіаті. Індустрія гуде.', emoji: '📰' },
]

const ARTIST_EVENTS: { title: string; description: string; emoji: string }[] = [
  { title: 'Ляля Колобок завагітніла', description: 'Після концерту до Дня ВМФ. Батько — загадковий моряк.', emoji: '👶' },
  { title: 'Зірка побила фаната', description: 'Фанат намагався сфотографувати артиста у вбиральні.', emoji: '👊' },
  { title: 'Панк-гурт побився з охороною', description: 'Охоронець фестивалю теж виявився панком. Помирилися пивом.', emoji: '🍺' },
  { title: 'Таємне весілля', description: 'Відомий виконавець одружився з власним менеджером у Лас-Вегасі.', emoji: '💒' },
  { title: 'Інопланетний семпл', description: 'Артист стверджує, що отримав музу від прибульців. Трек — хіт.', emoji: '👽' },
]

export const generateNews = (
  week: number,
  month: number,
  year: number,
  trends: Trend[],
  count: number = 3
): NewsItem[] => {
  const items: NewsItem[] = []

  // 1-2 новини про тренди
  const trendCount = Math.min(2, Math.max(1, Math.floor(count / 2)))
  const hotTrends = trends.filter((t) => t.popularity > 50 || t.direction !== 'peaking')
  for (const t of pickMany(hotTrends.length > 0 ? hotTrends : trends, trendCount)) {
    const template = pick(TREND_NEWS_TEMPLATES)
    const news = template(t)
    items.push({ id: uid(), week, month, year, ...news, type: 'trend' })
  }

  // Світова подія
  if (Math.random() < 0.6) {
    const ev = pick(WORLD_EVENTS)
    items.push({ id: uid(), week, month, year, ...ev, type: 'world' })
  }

  // Іноді — подія про артистів
  if (Math.random() < 0.5) {
    const ev = pick(ARTIST_EVENTS)
    items.push({ id: uid(), week, month, year, ...ev, type: 'artist' })
  }

  return items.slice(0, count)
}
