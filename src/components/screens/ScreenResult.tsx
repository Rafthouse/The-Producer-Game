import { motion } from 'framer-motion'
import type { SuccessType } from '../../types/game'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'
import { formatMoney, formatNumber, formatSigned } from '../../lib/format'

const SUCCESS_META: Record<SuccessType, { emoji: string; color: string; tagline: string }> = {
  'Провал': { emoji: '💀', color: '#ef4444', tagline: 'Навіть рідна мама не дослухала до приспіву' },
  'Локальний мем': { emoji: '😹', color: '#a855f7', tagline: 'Район у захваті. Решта світу — поки що ні' },
  'Нормальний реліз': { emoji: '👍', color: '#fbbf24', tagline: 'Цілком пристойно. Зарплату відбили' },
  'Хіт': { emoji: '🔥', color: '#fb923c', tagline: 'Радіо крутить, фанати верещать!' },
  'Культовий шедевр': { emoji: '🏆', color: '#22c55e', tagline: 'Про це писатимуть у підручниках!' },
}

function ResultStat({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="rounded-2xl border border-studio-600 bg-studio-800/70 p-4 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="font-display text-xl tabular-nums" style={{ color: color ?? '#fff' }}>
        {value}
      </div>
    </div>
  )
}

export function ScreenResult() {
  const result = useGameStore((s) => s.result)
  const artist = useGameStore((s) => s.artist)
  const next = useGameStore((s) => s.next)

  if (!result) return null
  const meta = SUCCESS_META[result.successType]

  return (
    <div className="flex flex-1 flex-col">
      {/* Штамп успіху */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
        className="mx-auto mb-6 w-full max-w-md rounded-3xl border-2 bg-studio-800/80 p-6 text-center shadow-glow"
        style={{ borderColor: meta.color, boxShadow: `0 0 60px -10px ${meta.color}66` }}
      >
        <div className="text-6xl">{meta.emoji}</div>
        <h2 className="mt-2 font-display text-3xl" style={{ color: meta.color }}>
          {result.successType}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">{meta.tagline}</p>
        <p className="mt-3 text-sm text-zinc-300">
          «{result.title}» — <span className="font-semibold text-white">{artist.name}</span>
        </p>
      </motion.div>

      {/* Цифри релізу */}
      <div className="grid grid-cols-3 gap-3">
        <ResultStat emoji="🎧" label="Прослуховування" value={formatNumber(result.listeners)} />
        <ResultStat
          emoji="❤️"
          label="Нові фани"
          value={formatSigned(result.fans)}
          color={result.fans >= 0 ? '#22c55e' : '#ef4444'}
        />
        <ResultStat
          emoji="💰"
          label="Прибуток"
          value={formatMoney(result.money)}
          color={result.money >= 0 ? '#22c55e' : '#ef4444'}
        />
      </div>

      {/* Події */}
      <div className="mt-6">
        <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Що сталося після релізу
        </h3>
        <ul className="space-y-2">
          {result.events.map((event, i) => (
            <motion.li
              key={event}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="flex items-start gap-3 rounded-2xl border border-studio-600 bg-studio-800/60 p-3.5"
            >
              <span className="mt-0.5 text-lg">📰</span>
              <span className="text-sm text-zinc-200">{event}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" onClick={next} className="w-full text-lg sm:w-auto sm:px-12">
          🔄 Новий артист
        </Button>
      </div>
    </div>
  )
}
