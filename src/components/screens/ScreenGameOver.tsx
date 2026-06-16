import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'
import { formatNumber } from '../../lib/format'
import { SPECIALIZATIONS } from '../../data/producer'

export function ScreenGameOver() {
  const label = useGameStore((s) => s.label)
  const calendar = useGameStore((s) => s.calendar)
  const producer = useGameStore((s) => s.producer)
  const restart = useGameStore((s) => s.restart)

  const specDef = producer ? SPECIALIZATIONS[producer.specialization] : null

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="text-center"
      >
        <div className="text-8xl mb-4">💀</div>
        <h1 className="font-display text-4xl text-red-400 sm:text-5xl">GAME OVER</h1>
        <p className="mt-3 text-zinc-400 max-w-sm mx-auto">
          Ваш лейбл збанкрутував. Артисти розбіглися, кредитори чергують біля студії.
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-3 rounded-3xl border border-studio-600 bg-studio-800/80 p-6">
        <h3 className="text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Підсумки
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-zinc-400">Прожито:</div>
          <div className="text-white font-display text-right">{calendar.week}/{calendar.month}/{calendar.year}</div>
          <div className="text-zinc-400">Всього релізів:</div>
          <div className="text-white font-display text-right">{label.releases}</div>
          <div className="text-zinc-400">Фанів:</div>
          <div className="text-white font-display text-right">{formatNumber(label.fans)}</div>
          <div className="text-zinc-400">Продюсер:</div>
          <div className="text-white font-display text-right">{producer?.name} ({specDef?.name})</div>
        </div>
      </div>

      <Button variant="primary" onClick={restart} className="sm:px-12">
        🔄 Спробувати ще
      </Button>
    </div>
  )
}
