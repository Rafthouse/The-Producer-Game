import { motion } from 'framer-motion'

interface StatBarProps {
  label: string
  /** 0–100 */
  value: number
  emoji?: string
  /** Інвертована шкала: високе значення = погано (напр. залежність). */
  invert?: boolean
}

const colorFor = (value: number, invert: boolean): string => {
  const good = invert ? 100 - value : value
  if (good >= 70) return '#22c55e'
  if (good >= 40) return '#fbbf24'
  return '#ef4444'
}

export function StatBar({ label, value, emoji, invert = false }: StatBarProps) {
  const color = colorFor(value, invert)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-400">
        <span>
          {emoji && <span className="mr-1">{emoji}</span>}
          {label}
        </span>
        <span className="tabular-nums text-zinc-200">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-studio-700">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
