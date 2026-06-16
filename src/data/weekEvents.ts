import type { WeekEvent } from '../types/game'
import { pickMany, uid } from '../lib/random'

export const WEEK_EVENTS: Omit<WeekEvent, 'id'>[] = [
  // Позитивні
  { title: 'Пісня стала вірусною!', description: 'Ваш трек підірвав TikTok. Фани в захваті!', type: 'positive', emoji: '📱', fanChange: 5000, moneyChange: 2000 },
  { title: 'Греммі номінація', description: 'Вашого артиста номінували на Греммі! Це неймовірно!', type: 'positive', emoji: '🏆', fanChange: 20000, moneyChange: 10000 },
  { title: 'Промо-тур вдався', description: 'Вдалий промо-тур приніс нових фанатів.', type: 'positive', emoji: '🎪', fanChange: 3000, moneyChange: 1500 },
  { title: 'Комплімент від критика', description: 'Відомий музичний критик похвалив ваш лейбл.', type: 'positive', emoji: '📰', fanChange: 1000, repChange: 3 },
  { title: 'Несподівані роялті', description: 'Ваша пісня потрапила в закордонний плейлист. Прийшли несподівані гроші!', type: 'positive', emoji: '🌍', moneyChange: 15000 },
  { title: 'Колаба з зіркою', description: 'Вашого артиста запросили на фіт із відомим виконавцем.', type: 'positive', emoji: '🤝', fanChange: 8000, moneyChange: 5000 },
  { title: 'Благодійний концерт', description: 'Артист дав благодійний концерт — репутація зросла.', type: 'positive', emoji: '❤️', repChange: 5, fanChange: 2000 },

  // Негативні
  { title: 'Скандал!', description: 'Вашого артиста спіймали на чомусь ганебному. Репутація падає!', type: 'negative', emoji: '📸', repChange: -8, fanChange: -5000 },
  { title: 'Наркоконтроль', description: 'До студії прийшов наркоконтроль. Доведеться платити штраф.', type: 'negative', emoji: '🚔', moneyChange: -20000 },
  { title: 'Фанати побилися', description: 'На концерті сталася бійка фанатів. Доведеться компенсувати збитки.', type: 'negative', emoji: '👊', moneyChange: -10000, repChange: -3 },
  { title: 'Технічна катастрофа', description: 'Згорів підсилювач. Потрібен терміновий ремонт.', type: 'negative', emoji: '⚡', moneyChange: -15000 },
  { title: 'Провальне інтерв\'ю', description: 'Артист сказав якусь дурість у прямому ефірі. Фани обурені.', type: 'negative', emoji: '🎤', fanChange: -3000, repChange: -4 },
  { title: 'Судовий позов', description: 'Хтось подав на вас до суду за плагіат. Юристи дорого коштують.', type: 'negative', emoji: '⚖️', moneyChange: -30000 },
  { title: 'Крадіжка обладнання', description: 'Вкрали обладнання зі студії. Страховка не покриває все.', type: 'negative', emoji: '🔧', moneyChange: -25000 },

  // Нейтральні / дивні
  { title: 'Артист став веганом', description: 'Ваш артист раптово вирішив стати веганом. Це ніяк не вплинуло на музику, але всі обговорюють.', type: 'neutral', emoji: '🥬', fanChange: 500 },
  { title: 'Барабанщик утік', description: 'Ваш барабанщик втік у монастир. Сказав, що знайшов себе.', type: 'neutral', emoji: '🙏', moneyChange: -5000 },
  { title: 'Холодець натхнення', description: 'Артист з\'їв холодець і написав новий хіт за ніч.', type: 'neutral', emoji: '🍮', tokenChange: 2 },
  { title: 'Помилка в афіші', description: 'На афіші написали ім\'я артиста з помилкою. Мем розійшовся мережею.', type: 'neutral', emoji: '🖼️', fanChange: 1000 },
  { title: 'Інопланетний семпл', description: 'Артист стверджує, що йому продиктували трек інопланетяни. Пісня стала хітом у районі.', type: 'neutral', emoji: '👽', fanChange: 2000 },
  { title: 'Голуб-співавтор', description: 'Голуб залетів у студію і сів на пульт — звук вийшов неймовірним.', type: 'neutral', emoji: '🕊️', tokenChange: 1 },
]

export const generateWeekEvents = (): WeekEvent[] => {
  const count = Math.random() < 0.35 ? 1 : 0
  if (count === 0) return []
  return pickMany(WEEK_EVENTS, 1).map(e => ({ ...e, id: uid() }))
}
