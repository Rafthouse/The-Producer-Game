import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'
import { formatMoney, formatNumber } from '../../lib/format'
import { STUDIO_UPGRADES, LABEL_SLOTS } from '../../data/studio'
import { SPECIALIZATIONS } from '../../data/producer'

export function ScreenWeekEnd() {
  const calendar = useGameStore((s) => s.calendar)
  const label = useGameStore((s) => s.label)
  const artists = useGameStore((s) => s.artists)
  const producer = useGameStore((s) => s.producer)
  const weekEvents = useGameStore((s) => s.weekEvents)
  const hiredStaff = useGameStore((s) => s.hiredStaff)
  const studioLevel = useGameStore((s) => s.studioLevel)
  const endWeek = useGameStore((s) => s.endWeek)
  const upgradeStudio = useGameStore((s) => s.upgradeStudio)
  const upgradeLabel = useGameStore((s) => s.upgradeLabel)
  const labelSlotIndex = useGameStore((s) => s.labelSlotIndex)
  const hireStaff = useGameStore((s) => s.hireStaff)
  const staffPool = useGameStore((s) => s.staffPool)
  const fireStaff = useGameStore((s) => s.fireStaff)
  const buyEquipment = useGameStore((s) => s.buyEquipment)
  const equipment = useGameStore((s) => s.equipment)
  const fireArtist = useGameStore((s) => s.fireArtist)

  const staffCost = hiredStaff.reduce((sum, s) => sum + s.salary, 0)
  const nextStudio = studioLevel < 6 ? STUDIO_UPGRADES[studioLevel] : null
  const nextLabel = labelSlotIndex < LABEL_SLOTS.length - 1 ? LABEL_SLOTS[labelSlotIndex + 1] : null
  const currentStudio = STUDIO_UPGRADES[studioLevel - 1]
  const currentLabel = LABEL_SLOTS[labelSlotIndex]

  const isNewMonth = calendar.week === 1
  const isNewYear = calendar.week === 1 && calendar.month === 1

  const specDef = producer ? SPECIALIZATIONS[producer.specialization] : null

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Кінець тижня</p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
          {calendar.week}/{calendar.month}/{calendar.year}
        </h2>
        {isNewMonth && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-lg"
          >
            {isNewYear ? '🎉 Новий рік!' : '📅 Новий місяць'}
          </motion.p>
        )}
      </div>

      {/* Профіль продюсера */}
      <div className="mb-6 rounded-2xl border border-studio-600 bg-studio-800/60 p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{specDef?.emoji ?? '🎧'}</div>
          <div>
            <div className="font-display text-sm text-white">
              {producer?.name ?? 'Продюсер'} · {specDef?.name ?? ''}
            </div>
            <div className="text-xs text-zinc-500">Репутація: {producer?.reputation ?? 50}%</div>
          </div>
        </div>
      </div>

      {/* Стан лейблу */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3 text-center">
          <div className="text-lg">💰</div>
          <div className="text-[10px] uppercase text-zinc-500">Бюджет</div>
          <div className="font-display text-lg text-white">{formatMoney(label.money)}</div>
        </div>
        <div className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3 text-center">
          <div className="text-lg">❤️</div>
          <div className="text-[10px] uppercase text-zinc-500">Фани</div>
          <div className="font-display text-lg text-white">{formatNumber(label.fans)}</div>
        </div>
        <div className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3 text-center">
          <div className="text-lg">🎵</div>
          <div className="text-[10px] uppercase text-zinc-500">Токени</div>
          <div className="font-display text-lg text-white">{label.tokens}</div>
        </div>
        <div className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3 text-center">
          <div className="text-lg">🎖️</div>
          <div className="text-[10px] uppercase text-zinc-500">Репутація</div>
          <div className="font-display text-lg text-white">{producer?.reputation ?? '?'}%</div>
        </div>
      </div>

      {/* Події тижня */}
      {weekEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            🌍 Події тижня
          </h3>
          <div className="space-y-2">
            {weekEvents.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl border p-3.5 ${
                  ev.type === 'positive'
                    ? 'border-green-700/50 bg-green-900/20'
                    : ev.type === 'negative'
                    ? 'border-red-700/50 bg-red-900/20'
                    : 'border-studio-600 bg-studio-800/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{ev.emoji}</span>
                  <div>
                    <div className="font-display text-sm text-white">{ev.title}</div>
                    <p className="text-xs text-zinc-400 mt-0.5">{ev.description}</p>
                    {(ev.moneyChange || ev.fanChange || ev.repChange) && (
                      <div className="mt-1 flex gap-2 text-[10px] text-zinc-500">
                        {ev.moneyChange && <span>{ev.moneyChange > 0 ? '+' : ''}{formatMoney(ev.moneyChange)}</span>}
                        {ev.fanChange && <span>{ev.fanChange > 0 ? '+' : ''}{formatNumber(ev.fanChange)} фанів</span>}
                        {ev.repChange && <span>{ev.repChange > 0 ? '+' : ''}{ev.repChange} реп.</span>}
                        {ev.tokenChange && <span>{ev.tokenChange > 0 ? '+' : ''}{ev.tokenChange} 🎵</span>}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Витрати */}
      {staffCost > 0 && (
        <div className="mb-4 rounded-2xl border border-studio-600 bg-studio-800/60 p-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Зарплата персоналу:</span>
            <span className="text-red-400 font-display">-{formatMoney(staffCost)}</span>
          </div>
        </div>
      )}

      {/* Артисти */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          🎤 Підписані артисти ({artists.length}/{currentLabel.slots})
        </h3>
        <div className="space-y-2">
          {artists.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-2xl border border-studio-600 bg-studio-800/60 p-3">
              <div>
                <div className="font-display text-sm text-white">{a.name}</div>
                <div className="text-xs text-zinc-500">
                  {a.genre.emoji} {a.genre.role} · ❤️ {a.happiness} · 💪 {a.health} · 📈 {a.popularity}
                </div>
              </div>
              <Button variant="danger" onClick={() => fireArtist(a.id)} className="text-xs px-3 py-1.5">
                ✕
              </Button>
            </div>
          ))}
          {artists.length === 0 && (
            <p className="text-xs text-zinc-600 text-center py-4">Немає підписаних артистів</p>
          )}
        </div>
      </div>

      {/* Студія */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          🏢 Студія — {currentStudio.name}
        </h3>
        <div className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400">{currentStudio.description}</div>
              <div className="text-xs text-zinc-500 mt-1">+{currentStudio.qualityBonus} бонус до якості</div>
            </div>
            {nextStudio && (
              <Button
                variant="primary"
                onClick={upgradeStudio}
                disabled={label.money < nextStudio.cost}
                className="text-xs px-3 py-1.5"
              >
                {formatMoney(nextStudio.cost)}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Обладнання */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          🛠️ Обладнання
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {equipment.filter(e => !e.owned).slice(0, 6).map((item) => (
            <div key={item.id} className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white">{item.name}</div>
                  <div className="text-[10px] text-zinc-500">+{item.bonus} якості</div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => buyEquipment(item.id)}
                  disabled={label.money < item.cost}
                  className="text-xs px-3 py-1.5"
                >
                  {formatMoney(item.cost)}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {equipment.filter(e => e.owned).length > 0 && (
          <p className="text-xs text-zinc-600 mt-2">
            Придбано: {equipment.filter(e => e.owned).map(e => e.name).join(', ')}
          </p>
        )}
      </div>

      {/* Персонал */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          👥 Персонал
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {staffPool.slice(0, 6).map((s) => (
            <div key={s.id} className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white">{s.name}</div>
                  <div className="text-[10px] text-zinc-500">
                    {s.role} · {formatMoney(s.salary)}/тиж · +{s.bonus}
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => hireStaff(s.id)}
                  disabled={hiredStaff.some(h => h.role === s.role)}
                  className="text-xs px-3 py-1.5"
                >
                  Найняти
                </Button>
              </div>
            </div>
          ))}
        </div>
        {hiredStaff.length > 0 && (
          <div className="mt-2 space-y-1">
            {hiredStaff.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-2xl border border-green-700/30 bg-green-900/10 p-2">
                <div>
                  <span className="text-xs text-green-400">{s.name}</span>
                  <span className="text-[10px] text-zinc-500 ml-2">{s.role}</span>
                </div>
                <Button variant="danger" onClick={() => fireStaff(s.id)} className="text-xs px-2 py-1">
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Лейбл апгрейд */}
      {nextLabel && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            🏢 Розширення лейблу
          </h3>
          <div className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white">{nextLabel.name}</div>
                <div className="text-[10px] text-zinc-500">{nextLabel.slots} слотів для артистів</div>
              </div>
              <Button
                variant="primary"
                onClick={upgradeLabel}
                disabled={label.money < nextLabel.cost}
                className="text-xs px-3 py-1.5"
              >
                {formatMoney(nextLabel.cost)}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Button variant="primary" onClick={endWeek} className="w-full text-lg sm:w-auto sm:px-12">
          ⏭ Далі
        </Button>
      </div>
    </div>
  )
}
