import type { NewsItem, Trend, GenreTrend } from '../types/game'
import type { GenreId } from '../types/game'
import { pick, uid, chance } from '../lib/random'
import { GENRE_META } from './trends'

// Шаблони новин про тренди
const TREND_NEWS_TEMPLATES: ((trend: Trend) => { title: string; description: string } )[] = [
  (t) => ({
    title: `Попит на "${t.name}" різко ${t.direction === 'rising' ? 'зростає' : t.direction === 'falling' ? 'падає' : 'стабілізувався'}`,
    description: `Музичні критики відзначають ${t.direction === 'rising' ? 'новий сплеск інтересу' : 'спад популярності'} до теми "${t.name}". ${t.direction === 'rising' ? 'Артисти цього напрямку матимуть перевагу.' : 'Варто уникати цієї теми.'}`,
  }),
  (t) => ({
    title: `Тема "${t.name}" — гаряча зараз`,
    description: `Слухачі активно шукають музику на тему "${t.name}". ${t.popularity > 70 ? 'Пік популярності!' : 'Хвиля набирає обертів.'}`,
  }),
]

// Світові події, що впливають на жанри
const WORLD_EVENTS: { title: string; description: string; emoji: string; affectsGenre?: GenreId; popularityShift?: number }[] = [
  { title: 'Економічна криза', description: 'Ціни на студійне обладнання зросли. Бюджети доведеться переглянути.', emoji: '📉' },
  { title: 'Міжнародний фестиваль', description: 'Відкрито заявки на участь у найбільшому музичному фестивалі року. Скористайтесь шансом!', emoji: '🎪' },
  { title: 'Технологічний прорив', description: 'Новий AI-інструмент для зведення музики вийшов на ринок. Електронна музика на підйомі!', emoji: '🤖', affectsGenre: 'electro', popularityShift: 3 },
  { title: 'Музична премія', description: 'Оголошено номінантів на щорічну музичну премію. Поп-виконавці лідирують.', emoji: '🏆', affectsGenre: 'pop', popularityShift: 2 },
  { title: 'Закон про авторські права', description: 'Новий закон посилює захист авторських прав у музичній індустрії.', emoji: '📜' },
  { title: 'Пандемія грипу', description: 'Через епідемію грипу багато концертів скасовують. Живі виступи під загрозою.', emoji: '🤧' },
  { title: 'Благодійний концерт', description: 'Організовується масштабний благодійний концерт. Усі жанри об\'єднуються!', emoji: '❤️' },
  { title: 'Скандал у музичній індустрії', description: 'Відомий продюсер звинувачений у плагіаті. Індустрія в шоці.', emoji: '📰' },
  { title: 'Рок-відродження', description: 'Молодь масово повертається до живої музики. Панк переживає ренесанс!', emoji: '🤘', affectsGenre: 'punk', popularityShift: 5 },
  { title: 'Хіп-хоп батл', description: 'Масштабний хіп-хоп батл зібрав мільйони глядачів онлайн. Реп знову в топі.', emoji: '🎙️', affectsGenre: 'rap', popularityShift: 3 },
  { title: 'Фолк-фестиваль', description: 'Фолк-фестиваль просто неба зібрав рекордну кількість відвідувачів.', emoji: '🌾', affectsGenre: 'folk', popularityShift: 4 },
  { title: 'Електронний рейв', description: 'Триденний рейв-марафон у пустелі. Електроніка править світом!', emoji: '🎛️', affectsGenre: 'electro', popularityShift: 4 },
]

// Події про артистів
const ARTIST_EVENTS: { title: string; description: string; emoji: string }[] = [
  { title: 'Ляля Колобок завагітніла', description: 'Після концерту до Дня ВМФ. Батько — загадковий моряк. Інтернет вибухнув мемами.', emoji: '👶' },
  { title: 'Зірка побила фаната', description: 'Фанат намагався сфотографувати артиста у вбиральні. Поліція розслідує.', emoji: '👊' },
  { title: 'Панк-гурт побився з охороною', description: 'Охоронець фестивалю теж виявився панком. Помирилися пивом і зіграли спільний сет.', emoji: '🍺' },
  { title: 'Таємне весілля', description: 'Відомий виконавець одружився з власним менеджером у Лас-Вегасі. Фанати в шоці.', emoji: '💒' },
  { title: 'Інопланетний семпл', description: 'Артист стверджує, що отримав музу від прибульців. Трек став вірусним.', emoji: '👽' },
  { title: 'Гучний фіт року', description: 'Два найпопулярніші виконавці записали спільний трек. Очікування божевільні!', emoji: '🎶' },
  { title: 'Артист пішов у монастир', description: 'Після трирічного творчого застою музикант вирішив знайти себе... у монастирі.', emoji: '🙏' },
  { title: 'Скандал на концерті', description: 'Артист викинув мікрофон у натовп. Фан отримав струс мозку і квиток на все життя.', emoji: '🎤' },
]

/** Генерує новини на основі поточних трендів і подій */
export const generateNews = (
  week: number,
  month: number,
  year: number,
  trends: Trend[],
  genreTrends: GenreTrend[],
  artistCount: number,
  count: number = 4
): NewsItem[] => {
  const items: NewsItem[] = []

  // 1. Жанрові новини — який жанр виріс/впав
  const hotGenre = pick(genreTrends)
  const genreMeta = GENRE_META[hotGenre.genreId]
  const genreDir = hotGenre.popularityMod > 0 ? 'зростає' : hotGenre.popularityMod < 0 ? 'падає' : 'стабільний'
  items.push({
    id: uid(), week, month, year,
    title: `Жанр ${genreMeta.emoji} ${genreMeta.name}: ${genreDir}`,
    description: `Популярність ${genreMeta.name.toLowerCase()} зараз ${hotGenre.popularity}%. ${
      hotGenre.popularityMod > 5 ? 'Це справжній бум!' :
      hotGenre.popularityMod > 0 ? 'Помірне зростання.' :
      hotGenre.popularityMod < -5 ? 'Серйозний спад. Час переключитись?' :
      'Тримається на плаву.'
    } Тема тижня: "${hotGenre.hotTopic}".`,
    emoji: genreMeta.emoji,
    type: 'trend',
  })

  // 2. Новини про тренди
  const hotTrends = trends.filter((t) => t.popularity > 60 || t.direction === 'rising')
  if (hotTrends.length > 0 && chance(0.7)) {
    const trend = pick(hotTrends)
    const template = pick(TREND_NEWS_TEMPLATES)
    const news = template(trend)
    items.push({ id: uid(), week, month, year, ...news, emoji: trend.emoji, type: 'trend' })
  }

  // 3. Світова подія
  if (chance(0.65)) {
    const ev = pick(WORLD_EVENTS)
    items.push({ id: uid(), week, month, year, ...ev, type: 'world' })
  }

  // 4. Подія про артистів
  if (chance(0.55)) {
    const ev = pick(ARTIST_EVENTS)
    items.push({ id: uid(), week, month, year, ...ev, type: 'artist' })
  }

  // 5. Якщо є артисти — новина про одного з них
  if (artistCount > 0 && chance(0.4)) {
    const artEvents = [
      { title: 'Ваш артист дав інтерв\'ю', description: 'Інтерв\'ю зібрало рекордну кількість переглядів. Піар працює!', emoji: '🎙️' },
      { title: 'Фанати в захваті', description: 'Вашого артиста помітили на обкладинці журналу. Репутація зростає!', emoji: '📰' },
    ]
    const news = pick(artEvents)
    items.push({ id: uid(), week, month, year, ...news, type: 'label' })
  }

  return items.slice(0, count)
}
