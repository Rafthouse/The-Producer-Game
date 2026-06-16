import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'
import { StatBar } from '../StatBar'
import { formatMoney } from '../../lib/format'
import { clamp } from '../../lib/random'
import { SPECIALIZATIONS } from '../../data/producer'
import { STUDIO_UPGRADES, LABEL_SLOTS } from '../../data/studio'

type LabelSubtab = 'producer' | 'artists' | 'studio' | 'staff'

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
          className="flex flex-1 flex-col"
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

/* ===== ПРОДЮСЕР ===== */
function ProducerPanel() {
  const producer = useGameStore((s) => s.producer)
  const label = useGameStore((s) => s.label)
  if (!producer) return null

  const spec = SPECIALIZATIONS[producer.specialization]
  const expPercent = Math.round((producer.experience / producer.experienceToNext) * 100)

  // Як бонуси продюсера впливають на гру
  const activeStaff = useGameStore((s) => s.hiredStaff)
  const studioLevel = useGameStore((s) => s.studioLevel)
  const currentStudio = STUDIO_UPGRADES[studioLevel - 1]

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Профіль */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-4xl border border-amber-500/30">
            {spec.emoji}
          </div>
          <div>
            <h2 className="font-display text-2xl text-white">{producer.name}</h2>
            <p className="text-sm text-amber-400">{spec.emoji} {spec.name}</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">{spec.description}</p>
          </div>
        </div>

        {/* Рівень та досвід */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Рівень</span>
            <span className="font-display text-lg text-amber-400">{producer.level}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-studio-600">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${expPercent}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>{producer.experience} XP</span>
            <span>{producer.experienceToNext} XP до {producer.level + 1}</span>
          </div>
        </div>

        <StatBar label="Репутація" value={producer.reputation} emoji="🎖️" />

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-zinc-500">
          <div className="rounded-xl bg-studio-700/40 p-2.5 text-center">
            <div className="font-display text-sm text-white">{label.releases}</div>
            <div className="text-[10px]">Релізів</div>
          </div>
          <div className="rounded-xl bg-studio-700/40 p-2.5 text-center">
            <div className="font-display text-sm text-white">{label.signed}</div>
            <div className="text-[10px]">Підписано</div>
          </div>
          <div className="rounded-xl bg-studio-700/40 p-2.5 text-center">
            <div className="font-display text-sm text-white">{activeStaff.length}</div>
            <div className="text-[10px]">Персоналу</div>
          </div>
        </div>
      </div>

      {/* Як бонуси впливають на гру */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-base text-white mb-3">📊 Активні бонуси</h3>
        <div className="space-y-2">
          <BonusRow label="Студія" value={`${currentStudio.name} (+${currentStudio.qualityBonus} якості)`} />
          <BonusRow label="Спеціалізація" value={`${spec.name}: ${spec.description} (×${(1 + (producer.level - 1) * 0.1).toFixed(1)} від рівня)`} />
          {activeStaff.find((s) => s.role === 'soundEngineer') && (
            <BonusRow label="Звукорежисер" value={`+${activeStaff.find((s) => s.role === 'soundEngineer')!.bonus} до якості`} />
          )}
          {activeStaff.find((s) => s.role === 'manager') && (
            <BonusRow label="Менеджер" value={`+${Math.round(activeStaff.find((s) => s.role === 'manager')!.bonus * 0.5)} до дисципліни релізу`} />
          )}
          {activeStaff.find((s) => s.role === 'pr') && (
            <BonusRow label="PR-менеджер" value={`+${Math.round(activeStaff.find((s) => s.role === 'pr')!.bonus * 0.3)} до популярності релізу`} />
          )}
        </div>
      </div>
    </div>
  )
}

function BonusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-studio-700/30 px-3 py-2">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-xs text-green-400">{value}</span>
    </div>
  )
}

/* ===== АРТИСТИ ===== */
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
      <div className="flex-1 flex items-center justify-center rounded-3xl border border-studio-600 bg-studio-800/80 p-8 text-center">
        <div>
          <div className="text-5xl mb-3">🎤</div>
          <p className="text-zinc-400 text-sm">Немає підписаних артистів</p>
          <p className="text-xs text-zinc-600 mt-1">Знайдіть артиста у вкладці «Студія»</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
      {artists.map((a) => {
        const freak = freakStatuses[a.id]
        const isExpanded = expandedId === a.id

        // Ризик скандалу: залежність + хаос трейтів
        const chaosTraits = a.traits.filter((t) =>
          ['Любить скандали', "Б'є журналістів", 'Тікає від податкової',
           'Вважає себе пророком', 'Танцює навіть на похоронах',
           'Зник на три роки в монастирі', 'Принципово не миється перед концертом',
           'Ненавидить менеджерів'].includes(t)
        ).length
        const scandalRisk = clamp(Math.round((a.addiction * 0.3 + chaosTraits * 5 + (70 - a.happiness) * 0.2) * (freak?.isTrashStar ? 1.5 : 1)), 0, 100)

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
                    {a.inRehab && <span className="text-red-400 animate-pulse">🏥 Рехаб</span>}
                    {a.pregnant && <span className="text-pink-400">🤰</span>}
                    {a.married && <span className="text-rose-400">💍</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.currentEvent && (
                  <span className="text-sm" title={a.currentEvent.title}>{a.currentEvent.emoji}</span>
                )}
                <MiniInlineBar value={a.popularity} color={a.popularity > 50 ? '#22c55e' : a.popularity > 30 ? '#fbbf24' : '#ef4444'} />
                <span className="text-zinc-600 text-xs">{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {/* Усі стати */}
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

                  {/* Ризики */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="rounded-xl bg-studio-700/40 p-2 text-center">
                      <div className="text-zinc-500 mb-0.5">Ризик скандалу</div>
                      <span className={scandalRisk > 60 ? 'text-red-400' : scandalRisk > 30 ? 'text-yellow-400' : 'text-green-400'}>
                        {scandalRisk}%
                      </span>
                    </div>
                    <div className="rounded-xl bg-studio-700/40 p-2 text-center">
                      <div className="text-zinc-500 mb-0.5">Продуктивність</div>
                      <span className={a.happiness > 60 ? 'text-green-400' : a.happiness > 30 ? 'text-yellow-400' : 'text-red-400'}>
                        {Math.round((a.discipline + a.happiness + a.health) / 3)}%
                      </span>
                    </div>
                    <div className="rounded-xl bg-studio-700/40 p-2 text-center">
                      <div className="text-zinc-500 mb-0.5">Рейтинги</div>
                      <span className="text-zinc-300">{a.localPop}/{a.nationalPop}/{a.globalPop}</span>
                    </div>
                  </div>

                  {/* Поточна подія */}
                  {a.currentEvent && (
                    <div className="rounded-xl border border-amber-600/30 bg-amber-900/15 p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-base">{a.currentEvent.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-display text-amber-300">{a.currentEvent.title}</span>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{a.currentEvent.description}</p>
                        </div>
                      </div>
                      {Object.keys(a.currentEvent.effects).length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {Object.entries(a.currentEvent.effects).map(([stat, val]) => (
                            <span key={stat}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                (val as number) > 0 ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                              }`}
                            >
                              {stat === 'health' ? '💪' : stat === 'happiness' ? '😊' :
                               stat === 'talent' ? '🎯' : stat === 'discipline' ? '⏰' :
                               stat === 'charisma' ? '✨' : stat === 'popularity' ? '📈' :
                               stat === 'addiction' ? '🍾' : stat === 'selfConfidence' ? '💪' : ''}
                              {(val as number) > 0 ? '+' : ''}{val as number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Додаткові статуси */}
                  {a.tour.status !== 'none' && (
                    <div className={`rounded-xl border p-2.5 text-xs ${
                      a.tour.status === 'success' ? 'border-green-700/30 bg-green-900/10 text-green-400'
                      : a.tour.status === 'failed' ? 'border-red-700/30 bg-red-900/10 text-red-400'
                      : 'border-amber-700/30 bg-amber-900/10 text-amber-400'
                    }`}>
                      🚀 Тур: {a.tour.status === 'success' ? `успішно (+${formatMoney(a.tour.expectedRevenue)}, +${a.tour.expectedFans} фанів)`
                        : a.tour.status === 'failed' ? 'невдало'
                        : 'триває'}
                    </div>
                  )}

                  {/* Потреби */}
                  {a.needs.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">⚠️ Потреби (ігнорування знизить щастя)</p>
                      <div className="space-y-1.5">
                        {a.needs.map((need) => (
                          <div key={need.id} className="flex items-center justify-between rounded-xl border border-studio-600 bg-studio-700/40 p-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{need.emoji}</span>
                              <div>
                                <span className="text-xs text-zinc-300">{need.title}</span>
                                <span className="text-[10px] text-zinc-600 ml-1">-{need.happinessPenalty} щастя</span>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <Button variant="primary" onClick={() => fulfillNeed(a.id, need.id)}
                                disabled={label.money < need.cost} className="text-xs px-2 py-1">
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
                  <div className="flex flex-wrap items-center gap-2">
                    {!a.inRehab && a.tour.status === 'none' && (
                      <Button variant="primary" onClick={() => startTour(a.id)}
                        disabled={label.money < (15000 + a.popularity * 500)} className="text-xs px-3 py-1.5">
                        🚀 Тур ({formatMoney(15000 + Math.round(a.popularity * 500))})
                      </Button>
                    )}
                    {a.addiction > 60 && !a.inRehab && (
                      <Button variant="primary" onClick={() => sendToRehab(a.id)}
                        disabled={label.money < 20000} className="text-xs px-3 py-1.5"
                        style={{ background: '#7c3aed' }}>
                        🏥 Рехаб (20К)
                      </Button>
                    )}
                    {a.inRehab && (
                      <span className="text-xs text-red-400 bg-red-900/20 border border-red-700/30 rounded-xl px-3 py-1.5">
                        🏥 В рехабі ще {a.rehabWeeksLeft} тижнів
                      </span>
                    )}
                    <Button variant="danger" onClick={() => fireArtist(a.id)} className="text-xs px-3 py-1.5">
                      🔴 Звільнити
                    </Button>
                  </div>

                  {/* Історія: графіки */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1.5">Історія</p>
                    <div className="grid grid-cols-2 gap-3">
                      <MiniChart data={a.history.map((h) => h.popularity)} color="#22c55e" label="Популярність" />
                      <MiniChart data={a.history.map((h) => h.health)} color="#06b6d4" label="Здоров'я" />
                      <MiniChart data={a.history.map((h) => h.happiness)} color="#fbbf24" label="Щастя" />
                      <MiniChart data={a.history.map((h) => h.money)} color="#a855f7" label="Прибуток" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

function MiniInlineBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-studio-600">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  )
}

function MiniChart({ data, color, label }: { data: number[]; color: string; label: string }) {
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
    <div className="rounded-xl bg-studio-900/50 p-2">
      <p className="text-[10px] text-zinc-600 mb-1">{label}</p>
      <svg viewBox="0 0 100 100" className="w-full h-12">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ===== СТУДІЯ + ОБЛАДНАННЯ ===== */
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
  const ownedEquipCount = equipment.filter((e) => e.owned).length
  const totalEquipBonus = equipment.filter((e) => e.owned).reduce((s, e) => s + e.bonus, 0)

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Студія */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🏢 Студія</h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-zinc-200">
              Рівень {studioLevel}: <span className="text-amber-400">{currentStudio.name}</span>
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{currentStudio.description}</p>
          </div>
          {nextStudio && (
            <Button variant="primary" onClick={upgradeStudio}
              disabled={label.money < nextStudio.cost} className="text-xs px-3 py-1.5">
              {formatMoney(nextStudio.cost)}
            </Button>
          )}
        </div>
        <div className="flex gap-3 text-[10px]">
          <div className="rounded-lg bg-studio-700/40 px-2.5 py-1.5">
            <span className="text-zinc-500">Бонус якості: </span>
            <span className="text-green-400">+{currentStudio.qualityBonus}</span>
          </div>
          {nextStudio && (
            <div className="rounded-lg bg-studio-700/40 px-2.5 py-1.5">
              <span className="text-zinc-500">Наступний: </span>
              <span className="text-zinc-300">{nextStudio.name} (+{nextStudio.qualityBonus})</span>
            </div>
          )}
        </div>
      </div>

      {/* Лейбл */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🏢 Розширення лейблу</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-200">{LABEL_SLOTS[labelSlotIndex].name}</p>
            <p className="text-xs text-zinc-500">{LABEL_SLOTS[labelSlotIndex].slots} слотів · {useGameStore.getState().artists.length} артистів</p>
          </div>
          {nextLabel && (
            <Button variant="primary" onClick={upgradeLabel}
              disabled={label.money < nextLabel.cost} className="text-xs px-3 py-1.5">
              {formatMoney(nextLabel.cost)} → {nextLabel.slots} слотів
            </Button>
          )}
        </div>
        {studioLevel >= 5 && (
          <p className="mt-2 text-xs text-amber-500">🏆 Майже імперія!</p>
        )}
      </div>

      {/* Обладнання */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-white">🛠️ Обладнання</h3>
          <span className="text-xs text-green-400">+{totalEquipBonus} бонусу · {ownedEquipCount}/17</span>
        </div>

        {/* Придбане */}
        {ownedEquipCount > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {equipment.filter((e) => e.owned).map((e) => (
              <span key={e.id} className="rounded-lg bg-green-900/20 border border-green-700/30 px-2 py-0.5 text-[10px] text-green-400">
                ✅ {e.name}
              </span>
            ))}
          </div>
        )}

        {/* Доступне для покупки */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {equipment.filter((e) => !e.owned).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-studio-700/40 p-2.5 hover:bg-studio-700/60 transition-colors">
              <div>
                <div className="text-xs text-white">{item.name}</div>
                <div className="text-[10px] text-zinc-500">+{item.bonus} до якості</div>
              </div>
              <Button variant="primary" onClick={() => buyEquipment(item.id)}
                disabled={label.money < item.cost} className="text-[10px] px-2 py-1">
                {formatMoney(item.cost)}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== ПЕРСОНАЛ ===== */
function StaffPanel() {
  const staffPool = useGameStore((s) => s.staffPool)
  const hiredStaff = useGameStore((s) => s.hiredStaff)
  const hireStaff = useGameStore((s) => s.hireStaff)
  const fireStaff = useGameStore((s) => s.fireStaff)

  // Як бонуси персоналу впливають
  const staffRoles = [
    { role: 'manager' as const, label: 'Менеджер', description: '+менеджмент до дисципліни релізів' },
    { role: 'soundEngineer' as const, label: 'Звукорежисер', description: '+якість запису' },
    { role: 'pr' as const, label: 'PR-менеджер', description: '+популярність релізів' },
    { role: 'lawyer' as const, label: 'Юрист', description: '+прибуток (знижка витрат)' },
    { role: 'accountant' as const, label: 'Бухгалтер', description: '-витрати студії' },
    { role: 'security' as const, label: 'Охоронець', description: '-ризик скандалів' },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Найняті */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-base text-white mb-3">👥 Персонал лейблу</h3>
        {hiredStaff.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-xs text-zinc-600">Ще нікого не найнято</p>
            <p className="text-[10px] text-zinc-700 mt-1">Кожен працівник дає бонуси до різних аспектів гри</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {hiredStaff.map((s) => {
              const roleDef = staffRoles.find((r) => r.role === s.role)
              return (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-green-900/10 border border-green-700/30 p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400 font-medium">{s.name}</span>
                      <span className="text-[10px] text-zinc-600 bg-studio-700/60 rounded px-1.5 py-0.5">{s.personality}</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {roleDef?.label} · {roleDef?.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-green-400 font-display">+{s.bonus}</div>
                      <div className="text-[10px] text-zinc-600">{formatMoney(s.salary)}/тиж</div>
                    </div>
                    <Button variant="danger" onClick={() => fireStaff(s.id)} className="text-xs px-2 py-1">
                      ✕
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Доступні кандидати */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-base text-white mb-3">📋 Ринок персоналу</h3>
        <p className="text-[10px] text-zinc-600 mb-3">Можна найняти лише одного фахівця на кожну роль</p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {staffPool.map((s) => {
            const roleDef = staffRoles.find((r) => r.role === s.role)
            const alreadyHired = hiredStaff.some((h) => h.role === s.role)
            return (
              <div key={s.id} className={`flex items-center justify-between rounded-xl bg-studio-700/40 p-2.5 transition-colors ${
                alreadyHired ? 'opacity-50' : 'hover:bg-studio-700/60'
              }`}>
                <div>
                  <div className="text-xs text-white">{s.name}</div>
                  <div className="text-[10px] text-zinc-500">
                    {roleDef?.label} · {s.personality}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">
                    +{s.bonus} · {formatMoney(s.salary)}/тиж
                  </div>
                  <div className="text-[10px] text-green-600">{roleDef?.description}</div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => hireStaff(s.id)}
                  disabled={alreadyHired}
                  className="text-xs px-2 py-1"
                >
                  {alreadyHired ? 'Найнято' : 'Найняти'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
