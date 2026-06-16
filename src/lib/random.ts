// Невеликі помічники для роботи з випадковістю.

export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const randFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min

export const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

export const chance = (p: number): boolean => Math.random() < p

export const shuffle = <T>(arr: readonly T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const pickMany = <T>(arr: readonly T[], n: number): T[] =>
  shuffle(arr).slice(0, Math.min(n, arr.length))

export const uid = (): string => Math.random().toString(36).slice(2, 10)

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

/** Зважений вибір: приймає пари [значення, вага] */
export const weighted = <T>(pairs: [T, number][]): T => {
  const total = pairs.reduce((s, [, w]) => s + w, 0)
  let r = Math.random() * total
  for (const [val, w] of pairs) {
    r -= w
    if (r <= 0) return val
  }
  return pairs[pairs.length - 1][0]
}

/** Генерує нормально розподілене число (наближено) із центром ~50 */
export const randNorm = (mean: number = 50, sd: number = 15): number => {
  // Box-Muller
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return clamp(Math.round(mean + z * sd), 10, 90)
}
