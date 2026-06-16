// Риси характеру артистів. Деякі впливають на розрахунок релізу.

export interface TraitDef {
  name: string
  /** Прямий вплив на бал релізу (може бути від’ємним) */
  scoreMod?: number
  /** Підвищує «хаос» — шанс скандальних/диких подій */
  chaosMod?: number
}

export const TRAITS: TraitDef[] = [
  { name: 'Працює за їжу', scoreMod: -2 },
  { name: 'Любить скандали', scoreMod: 5, chaosMod: 3 },
  { name: "Б'є журналістів", scoreMod: 2, chaosMod: 4 },
  { name: 'Хронічний романтик', scoreMod: 3 },
  { name: 'Постійно запізнюється', scoreMod: -5 },
  { name: 'Ненавидить менеджерів', scoreMod: -2, chaosMod: 2 },
  { name: 'Геній самопіару', scoreMod: 8 },
  { name: 'Має фанатку-бабусю з мільйоном підписників', scoreMod: 7 },
  { name: 'Співає лише в душі', scoreMod: -3 },
  { name: 'Вірить у рептилоїдів', chaosMod: 2 },
  { name: 'Колекціонує чайники', scoreMod: 1 },
  { name: 'Завжди босоніж', chaosMod: 1 },
  { name: 'Тікає від податкової', scoreMod: 4, chaosMod: 3 },
  { name: 'Розмовляє з холодильником', chaosMod: 2 },
  { name: 'Колишній сантехнік', scoreMod: 2 },
  { name: 'Спить по 16 годин', scoreMod: -4 },
  { name: 'Не вміє читати ноти', scoreMod: -3 },
  { name: 'Абсолютний слух (так каже)', scoreMod: 3 },
  { name: 'Закоханий у власне відображення', scoreMod: 4, chaosMod: 1 },
  { name: 'Веган-екстреміст', chaosMod: 2 },
  { name: 'Має 14 котів', scoreMod: 1 },
  { name: 'Боїться мікрофонів', scoreMod: -6 },
  { name: 'Вважає себе пророком', scoreMod: 3, chaosMod: 3 },
  { name: 'Танцює навіть на похоронах', chaosMod: 2 },
  { name: 'Платить шанувальникам за оплески', scoreMod: 5 },
  { name: 'Гіперактивний після кави', scoreMod: 2, chaosMod: 1 },
  { name: 'Зник на три роки в монастирі', chaosMod: 2 },
  { name: 'Виступає тільки в халаті', chaosMod: 1 },
  { name: 'Колишня зірка ютубу', scoreMod: 6 },
  { name: 'Принципово не миється перед концертом', chaosMod: 3 },
]
