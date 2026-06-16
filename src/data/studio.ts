import type { StudioUpgrade, Equipment, StaffMember, StaffRole } from '../types/game'
import { pick, uid } from '../lib/random'

export const STUDIO_UPGRADES: StudioUpgrade[] = [
  { level: 1, name: 'Гараж', qualityBonus: 0, cost: 0, description: 'Стартовий рівень. Хоч дах не тече.' },
  { level: 2, name: 'Підвал', qualityBonus: 3, cost: 15_000, description: 'Холодно, але акустика пристойна.' },
  { level: 3, name: 'Домашня студія', qualityBonus: 7, cost: 50_000, description: 'Вже можна не соромитись.' },
  { level: 4, name: 'Комерційна студія', qualityBonus: 12, cost: 200_000, description: 'Серйозний інструментарій.' },
  { level: 5, name: 'Преміум студія', qualityBonus: 18, cost: 800_000, description: 'Записують альбоми зірки.' },
  { level: 6, name: 'Abbey Road', qualityBonus: 25, cost: 3_000_000, description: 'Легендарний рівень якості.' },
]

export const LABEL_SLOTS: { slots: number; cost: number; name: string }[] = [
  { slots: 2, cost: 0, name: 'Стартовий лейбл' },
  { slots: 4, cost: 30_000, name: 'Малий лейбл' },
  { slots: 6, cost: 120_000, name: 'Середній лейбл' },
  { slots: 8, cost: 400_000, name: 'Великий лейбл' },
  { slots: 10, cost: 1_000_000, name: 'Лейбл-гігант' },
  { slots: 12, cost: 2_500_000, name: 'Імперія звуку' },
]

export const EQUIPMENT_LIST: Omit<Equipment, 'owned'>[] = [
  { id: 'mic-1', type: 'microphone', name: 'Шурячий мікрофон', cost: 2_000, bonus: 2 },
  { id: 'mic-2', type: 'microphone', name: 'Shure SM7B', cost: 15_000, bonus: 5 },
  { id: 'mic-3', type: 'microphone', name: 'Neumann U87', cost: 80_000, bonus: 10 },
  { id: 'mon-1', type: 'monitor', name: 'Колонки з ринку', cost: 3_000, bonus: 2 },
  { id: 'mon-2', type: 'monitor', name: 'Yamaha HS8', cost: 25_000, bonus: 5 },
  { id: 'mon-3', type: 'monitor', name: 'Genelec 8351B', cost: 150_000, bonus: 10 },
  { id: 'comp-1', type: 'compressor', name: 'Компресор RNC', cost: 8_000, bonus: 3 },
  { id: 'comp-2', type: 'compressor', name: 'SSL G-Bus', cost: 60_000, bonus: 7 },
  { id: 'synth-1', type: 'synth', name: 'Монофонічний писк', cost: 5_000, bonus: 2 },
  { id: 'synth-2', type: 'synth', name: 'Moog Subsequent 37', cost: 100_000, bonus: 8 },
  { id: 'synth-3', type: 'synth', name: 'Access Virus TI2', cost: 150_000, bonus: 10 },
  { id: 'acou-1', type: 'acoustic', name: 'Матраци на стінах', cost: 5_000, bonus: 2 },
  { id: 'acou-2', type: 'acoustic', name: 'Акустичні панелі', cost: 30_000, bonus: 5 },
  { id: 'acou-3', type: 'acoustic', name: 'Професійна акустика', cost: 120_000, bonus: 9 },
  { id: 'light-1', type: 'lighting', name: 'Лампочка Ілліча', cost: 500, bonus: 1 },
  { id: 'light-2', type: 'lighting', name: 'Світлодіодний сет', cost: 20_000, bonus: 4 },
  { id: 'light-3', type: 'lighting', name: 'Професійне світло', cost: 100_000, bonus: 7 },
]

const STAFF_NAMES: Record<StaffRole, string[]> = {
  manager: ['Ігор Менеджер', 'Оксана Агент', 'Влад Промоутер'],
  soundEngineer: ['Діма Звук', 'Сашко Біт', 'Юра Мікшер'],
  pr: ['Катя Піар', 'Рома Медіа', 'Настя Промо'],
  lawyer: ['Льоша Юрист', 'Олена Адвокат', 'Сергій Правознавець'],
  accountant: ['Таня Бух', 'Міша Облік', 'Люда Податок'],
  security: ['Петро Охорона', 'Вадим Безпека', 'Гриша Вишибала'],
}

const STAFF_PERSONALITIES: Record<string, string[]> = {
  manager: ['Діловий', 'Вигорає', 'Харизматичний', 'Бюрократ', 'Авантюрист'],
  soundEngineer: ['Перфекціоніст', 'Розсіяний', 'Гік', 'Мінімаліст', 'Експериментатор'],
  pr: ['Медійник', 'Інтриган', 'Оптиміст', 'Цинік', 'Маніпулятор'],
  lawyer: ['Скрупульозний', 'Хитрий', 'Педант', 'Вигорає', 'Хабарник'],
  accountant: ['Жадібний', 'Акуратний', 'Флегматик', 'Тривожний', 'Щедрий'],
  security: ['Суворий', 'Добряк', 'Підозрілий', 'Колишній десантник', 'Любитель музики'],
}

const STAFF_BONUSES: Record<StaffRole, number> = {
  manager: 5,
  soundEngineer: 8,
  pr: 7,
  lawyer: 6,
  accountant: 5,
  security: 4,
}

const STAFF_SALARIES: Record<StaffRole, number> = {
  manager: 4000,
  soundEngineer: 6000,
  pr: 3500,
  lawyer: 5000,
  accountant: 3000,
  security: 2500,
}

export const generateStaffPool = (): Omit<StaffMember, 'hired' | 'weekHired'>[] => {
  const roles = Object.keys(STAFF_NAMES) as StaffRole[]
  const pool: Omit<StaffMember, 'hired' | 'weekHired'>[] = []
  for (const role of roles) {
    for (const name of STAFF_NAMES[role]) {
      pool.push({
        id: uid(),
        name,
        role,
        salary: STAFF_SALARIES[role],
        bonus: STAFF_BONUSES[role],
        personality: pick(STAFF_PERSONALITIES[role]),
      })
    }
  }
  return pool
}
