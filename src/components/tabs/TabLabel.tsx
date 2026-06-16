import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'
import { StatBar } from '../StatBar'
import { formatMoney } from '../../lib/format'
import { SPECIALIZATIONS } from '../../data/producer'
import { STUDIO_UPGRADES, LABEL_SLOTS } from '../../data/studio'

type LabelSubtab = 'producer' | 'artists' | 'staff' | 'studio'

/**
 * Вкладка 2: Лейбл
 * Продюсер · Студія · Персонал · Артисти · Тури · Рехаб
 */
export function TabLabel() {
  const [subtab, setSubtab] = useState<LabelSubtab>('producer')

  const tabs: { key: LabelSubtab; label: string; emoji: string }[] = [
    { key: 'producer', label: 'Продюсер', emoji: '🎧' },
    { key: 'artists', label: 'Артисти', emoji: '🎤' },
    { key: 'studio', label: 'Студія', emoji: '🏢' },
    { key: 'staff', label: 'Персонал', emoji: '👥' },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex gap-1 rounded-xl border border-studio-600 bg-studio-800/60 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubtab(t.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-display transition-all ${
              subtab === t.key
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subtab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {subtab === 'producer' && <ProducerPanel />}
          {subtab === 'artists' && <ArtistsPanel />}
          {subtab === 'studio' && <StudioEquipmentPanel />}
          {subtab === 'staff' && <StaffPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ProducerPanel() {
  const producer = useGameStore((s) => s.producer)
  const label = useGameStore((s) => s.label)
  if (!producer) return null

  const spec = SPECIALIZATIONS[producer.specialization]

  return (
    <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-studio-700 text-4xl border border-studio-500">
          {spec.emoji}
        </div>
        <div>
          <h2 className="font-display text-2xl text-white">{producer.name}</h2>
          <p className="text-sm text-amber-400">{spec.emoji} {spec.name}</p>
          <p className="text-xs text-zinc-500 mt-1">{spec.description}</p>
        </div>
      </div>

      <StatBar label="Репутація" value={producer.reputation} emoji="🎖️" />
      <div className="mt-4 text-xs text-zinc-500 space-y-1">
        <p>📀 Всього релізів: {label.releases}</p>
        <p>✍️ Підписано артистів: {label.signed}</p>
      </div>
    </div>
  )
}

function ArtistsPanel() {
  const artists = useGameStore((s) => s.artists)
  const startTour = useGameStore((s) => s.startTour)
  const sendToRehab = useGameStore((s) => s.sendToRehab)
  const fulfillNeed = useGameStore((s) => s.fulfillNeed)
  const ignoreNeed = useGameStore((s) => s.ignoreNeed)
  const fireArtist = useGameStore((s) => s.fireArtist)
  const label = useGameStore((s) => s.label)
  const freakStatuses = useGameStore((s) => s.freakStatuses)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (artists.length === 0) {
    return (
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-6 text-center">
        <div className="text-4xl mb-2">🎤</div>
        <p className="text-zinc-400 text-sm">Немає підписаних артистів</p>
        <p className="text-xs text-zinc-600 mt-1">Підпишіть артиста у вкладці «Студія»</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {artists.map((a) => {
        const freak = freakStatuses[a.id]
        const isExpanded = expandedId === a.id
        return (
          <motion.div
            key={a.id}
            layout
            className="rounded-3xl border border-studio-600 bg-studio-800/80 p-4"
            style={{ boxShadow: `0 0 30px -10px ${a.genre.accent}33` }}
          >
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : a.id)}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{a.genre.emoji}</div>
                <div>
                  <div className="font-display text-base text-white">{a.name}</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{a.genre.role}</span>
                    {freak?.isTrashStar && <span className="text-purple-400">🌟 Треш-зірка</span>}
                    {freak?.isFreak && !freak.isTrashStar && <span className="text-orange-400">🤪 Фрік</span>}
                    {a.inRehab && <span className="text-red-400">🏥 Рехаб</span>}
                  </div>
                </div>
              </div>
              <div className="text-zinc-600">{isExpanded ? '▲' : '▼'}</div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <StatBar label="Талант" value={a.talent} emoji="🎯" />
                    <StatBar label="Харизма" value={a.charisma} emoji="✨" />
                    <StatBar label="Дисципліна" value={a.discipline} emoji="⏰" />
                    <StatBar label="Популярність" value={a.popularity} emoji="📈" />
                    <StatBar label="Здоров'я" value={a.health} emoji="💪" />
                    <StatBar label="Щастя" value={a.happiness} emoji="😊" />
                    <StatBar label="Самовпевненість" value={a.selfConfidence} emoji="💪" />
                    <StatBar label="Залежність" value={a.addiction} emoji="🍾" invert />
                  </div>

                  {/* Рейтинги */}
                  <div className="flex gap-4 text-xs text-zinc-500">
                    <span>Локально: {a.localPop}</span>
                    <span>Національно: {a.nationalPop}</span>
                    <span>Глобально: {a.globalPop}</span>
                  </div>

                  {/* Потреби */}
                  {a.needs.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">⚠️ Потреби</p>
                      <div className="space-y-1.5">
                        {a.needs.map((need) => (
                          <div key={need.id} className="flex items-center justify-between rounded-xl border border-studio-600 bg-studio-700/40 p-2.5">
                            <div>
                              <span className="text-sm">{need.emoji}</span>
                              <span className="text-xs text-zinc-300 ml-2">{need.title}</span>
                              <span className="text-xs text-zinc-600 ml-1">-{need.happinessPenalty} щастя</span>
                            </div>
                            <div className="flex gap-1.5">
                              <Button variant="primary" onClick={() => fulfillNeed(a.id, need.id)} disabled={label.money < need.cost} className="text-xs px-2 py-1">
                                {formatMoney(need.cost)}
                              </Button>
                              <Button variant="danger" onClick={() => ignoreNeed(a.id, need.id)} className="text-xs px-2 py-1">
                                ✕
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Дії */}
                  <div className="flex flex-wrap gap-2">
                    {!a.inRehab && a.tour.status === 'none' && (
                      <Button variant="primary" onClick={() => startTour(a.id)} className="text-xs px-3 py-1.5">
                        🚀 Відправити в тур
                      </Button>
                    )}
                    {a.addiction > 60 && !a.inRehab && (
                      <Button variant="primary" onClick={() => sendToRehab(a.id)} className="text-xs px-3 py-1.5" style={{ background: '#7c3aed' }}>
                        🏥 Рехаб
                      </Button>
                    )}
                    {a.inRehab && (
                      <span className="text-xs text-red-400 py-1.5">🏥 В рехабі ({a.rehabWeeksLeft} тиж.)</span>
                    )}
                    {a.tour.status !== 'none' && (
                      <span className={`text-xs py-1.5 ${a.tour.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        🚀 Тур: {a.tour.status === 'success' ? 'успішно (+' + formatMoney(a.tour.expectedRevenue) + ')' : 'невдало'}
                      </span>
                    )}
                    <Button variant="danger" onClick={() => fireArtist(a.id)} className="text-xs px-3 py-1.5">
                      🔴 Звільнити
                    </Button>
                  </div>

                  {/* Графік історії */}
                  {a.history.length > 2 && (
                    <div className="mt-2">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Історія популярності</p>
                      <MiniChart data={a.history.map((h) => h.popularity)} color={a.genre.accent} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const max = Math.max(...data, 90)
  const min = Math.min(...data, 10)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((v - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className="w-full h-16 rounded-lg bg-studio-900/50">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StudioEquipmentPanel() {
  const studioLevel = useGameStore((s) => s.studioLevel)
  const upgradeStudio = useGameStore((s) => s.upgradeStudio)
  const label = useGameStore((s) => s.label)
  const equipment = useGameStore((s) => s.equipment)
  const buyEquipment = useGameStore((s) => s.buyEquipment)
  const labelSlotIndex = useGameStore((s) => s.labelSlotIndex)
  const upgradeLabel = useGameStore((s) => s.upgradeLabel)

  const currentStudio = STUDIO_UPGRADES[studioLevel - 1]
  const nextStudio = studioLevel < 6 ? STUDIO_UPGRADES[studioLevel] : null
  const nextLabel = labelSlotIndex < LABEL_SLOTS.length - 1 ? LABEL_SLOTS[labelSlotIndex + 1] : null

  return (
    <div className="space-y-4">
      {/* Студія */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-2">🏢 Студія</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-200">
              Рівень {studioLevel}: {currentStudio.name}
            </p>
            <p className="text-xs text-zinc-500">{currentStudio.description}</p>
            <p className="text-xs text-green-400 mt-1">+{currentStudio.qualityBonus} бонус до якості</p>
          </div>
          {nextStudio && (
            <Button variant="primary" onClick={upgradeStudio} disabled={label.money < nextStudio.cost} className="text-xs px-3 py-1.5">
              {formatMoney(nextStudio.cost)}
            </Button>
          )}
        </div>
      </div>

      {/* Лейбл */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-2">🏢 Лейбл</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-200">{LABEL_SLOTS[labelSlotIndex].name}</p>
            <p className="text-xs text-zinc-500">{LABEL_SLOTS[labelSlotIndex].slots} слотів для артистів</p>
          </div>
          {nextLabel && (
            <Button variant="primary" onClick={upgradeLabel} disabled={label.money < nextLabel.cost} className="text-xs px-3 py-1.5">
              {formatMoney(nextLabel.cost)}
            </Button>
          )}
        </div>
      </div>

      {/* Обладнання */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🛠️ Обладнання</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {equipment.filter((e) => !e.owned).slice(0, 8).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-studio-700/40 p-2.5">
              <div>
                <div className="text-xs text-white">{item.name}</div>
                <div className="text-[10px] text-zinc-500">+{item.bonus} якості</div>
              </div>
              <Button variant="primary" onClick={() => buyEquipment(item.id)} disabled={label.money < item.cost} className="text-xs px-2 py-1">
                {formatMoney(item.cost)}
              </Button>
            </div>
          ))}
        </div>
        {equipment.filter((e) => e.owned).length > 0 && (
          <p className="mt-2 text-xs text-green-500">
            ✅ Придбано: {equipment.filter((e) => e.owned).map((e) => e.name).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}

function StaffPanel() {
  const staffPool = useGameStore((s) => s.staffPool)
  const hiredStaff = useGameStore((s) => s.hiredStaff)
  const hireStaff = useGameStore((s) => s.hireStaff)
  const fireStaff = useGameStore((s) => s.fireStaff)

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-base text-white mb-3">👥 Найнятий персонал</h3>
        {hiredStaff.length === 0 ? (
          <p className="text-xs text-zinc-600">Ще нікого не найнято</p>
        ) : (
          <div className="space-y-1.5">
            {hiredStaff.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl bg-green-900/10 border border-green-700/30 p-2.5">
                <div>
                  <span className="text-xs text-green-400">{s.name}</span>
                  <span className="text-[10px] text-zinc-500 ml-2">{s.role} · {s.personality}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <span>{formatMoney(s.salary)}/тиж</span>
                  <span className="text-green-400">+{s.bonus}</span>
                  <Button variant="danger" onClick={() => fireStaff(s.id)} className="text-xs px-2 py-0.5">
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-base text-white mb-3">📋 Доступні кандидати</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {staffPool.slice(0, 8).map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl bg-studio-700/40 p-2.5">
              <div>
                <div className="text-xs text-white">{s.name}</div>
                <div className="text-[10px] text-zinc-500">
                  {s.role} · {s.personality} · +{s.bonus} · {formatMoney(s.salary)}/тиж
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => hireStaff(s.id)}
                disabled={hiredStaff.some((h) => h.role === s.role)}
                className="text-xs px-2 py-1"
              >
                Найняти
              </Button>
            </div>
          ))}
        </div>
        {staffPool.length > 8 && (
          <p className="text-xs text-zinc-600 mt-2">+{staffPool.length - 8} інших кандидатів</p>
        )}
      </div>
    </div>
  )
}
