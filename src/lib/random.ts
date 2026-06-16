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
