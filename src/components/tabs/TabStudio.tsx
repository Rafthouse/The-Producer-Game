import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { ArtistCard } from '../ArtistCard'
import { Button } from '../ui/Button'
import { StatBar } from '../StatBar'
import { formatMoney, formatNumber, formatSigned } from '../../lib/format'

/**
 * Вкладка 1: Студія
 */
export function TabStudio() {
  const artistPair = useGameStore((s) => s.artistPair)
  const currentArtist = useGameStore((s) => s.currentArtist)
  const artists = useGameStore((s) => s.artists)
  const result = useGameStore((s) => s.result)
  const tokens = useGameStore((s) => s.label.tokens)
  const rejectedThisWeek = useGameStore((s) => s.rejectedThisWeek)

  const signArtist = useGameStore((s) => s.signArtist)
  const rejectBoth = useGameStore((s) => s.rejectBoth)
  const selectArtistForRelease = useGameStore((s) => s.selectArtistForRelease)
  const release = useGameStore((s) => s.release)
  const endWeek = useGameStore((s) => s.endWeek)
  const fireArtist = useGameStore((s) => s.fireArtist)

  if (result) {
    return <StudioResult />
  }

  if (currentArtist) {
    return <StudioRecording artist={currentArtist} onRelease={release} onBack={() => useGameStore.setState({ currentArtist: null })} tokens={tokens} />
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Студія</p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
          {artists.length > 0 ? 'Оберіть артиста для запису' : 'Нові артисти'}
        </h2>
        {artists.length > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            Підписано: {artists.length} · 🎵 {tokens}
          </p>
        )}
      </div>

      {artists.length > 0 && (
        <div className="mb-4 space-y-2">
          {artists.map((a) => (
            <motion.div
              key={a.id}
              layout
              className="flex items-center justify-between rounded-2xl border border-studio-600 bg-studio-800/70 p-3"
              style={{ boxShadow: `0 0 20px -8px ${a.genre.accent}44` }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{a.genre.emoji}</div>
                <div>
                  <div className="font-display text-sm text-white">{a.name}</div>
                  <div className="text-xs text-zinc-500">
                    🎯 {a.talent} · ✨ {a.charisma} · 📈 {a.popularity} · ❤️ {a.happiness}
                    {a.needs.length > 0 && <span className="ml-2 text-amber-400">⚠️ {a.needs.length} потреб</span>}
                    {a.inRehab && <span className="ml-2 text-red-400">🏥 Рехаб</span>}
                  </div>
                  <p className="mt-1 text-[11px] italic text-zinc-500 line-clamp-1">
                    «{a.songText.split('\n')[0]}»
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button variant="primary" onClick={() => selectArtistForRelease(a.id)} className="text-xs px-3 py-1.5" disabled={tokens < 1}>
                  🎙️
                </Button>
                <Button variant="danger" onClick={() => fireArtist(a.id)} className="text-xs px-3 py-1.5">
                  ✕
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {artistPair && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              <ArtistCard key={artistPair[0].id} artist={artistPair[0]} compact />
              <ArtistCard key={artistPair[1].id} artist={artistPair[1]} compact />
            </AnimatePresence>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button variant="primary" onClick={() => signArtist(0)} className="w-full">
              ✍️ Першого
            </Button>
            <Button variant="primary" onClick={() => signArtist(1)} className="w-full">
              ✍️ Другого
            </Button>
            <Button variant="danger" onClick={rejectBoth} className="w-full">
              🚪 Відмовити обом
            </Button>
          </div>
        </>
      )}

      {rejectedThisWeek > 0 && (
        <p className="mt-3 text-center text-xs text-zinc-500">
          Відхилено: {rejectedThisWeek}
        </p>
      )}

      {artists.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" onClick={endWeek} className="text-sm">
            ⏭ Завершити тиждень
          </Button>
        </div>
      )}
    </div>
  )
}

function StudioRecording({ artist, onRelease, onBack, tokens }: {
  artist: NonNullable<ReturnType<typeof useGameStore.getState>['currentArtist']>
  onRelease: () => void
  onBack: () => void
  tokens: number
}) {
  const { genre } = artist
  const canRelease = tokens >= 1

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Студія</p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">Запис синглу</h2>
        <p className="mt-1 text-xs text-zinc-500">🎵 {tokens} · Вартість: 1 🎵</p>
      </div>

      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-6 shadow-glow"
        style={{ boxShadow: `0 0 50px -12px ${genre.accent}55` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${genre.accent}22`, boxShadow: `inset 0 0 0 2px ${genre.accent}55` }}
          >{genre.emoji}</div>
          <div>
            <div className="font-display text-xl text-white">{artist.name}</div>
            <div className="text-sm text-zinc-400">{genre.emoji} {genre.role}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <StatBar label="Талант" value={artist.talent} emoji="🎯" />
          <StatBar label="Харизма" value={artist.charisma} emoji="✨" />
          <StatBar label="Дисципліна" value={artist.discipline} emoji="⏰" />
          <StatBar label="Популярність" value={artist.popularity} emoji="📈" />
          <StatBar label="Самовпевненість" value={artist.selfConfidence} emoji="💪" />
          <StatBar label="Щастя" value={artist.happiness} emoji="😊" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Трек</p>
          <p className="mt-1 font-display text-2xl" style={{ color: genre.accent }}>«{artist.trackTitle}»</p>
        </div>

        <div className="mt-4 rounded-2xl border border-studio-600 bg-studio-900/70 p-4">
          <p className="whitespace-pre-line text-center text-sm italic leading-relaxed text-zinc-300">{artist.songText}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-col items-center gap-3">
        {!canRelease && <p className="text-xs text-red-400">Недостатньо токенів!</p>}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>← Назад</Button>
          <Button variant="primary" onClick={onRelease} disabled={!canRelease}>
            🎙️ Випустити (1 🎵)
          </Button>
        </div>
      </div>
    </div>
  )
}

function StudioResult() {
  const result = useGameStore((s) => s.result)
  const endWeek = useGameStore((s) => s.endWeek)

  if (!result) return null

  const meta = {
    'Провал': { emoji: '💀', color: '#ef4444', tagline: 'Навіть рідна мама не дослухала' },
    'Локальний мем': { emoji: '😹', color: '#a855f7', tagline: 'Район у захваті' },
    'Нормальний реліз': { emoji: '👍', color: '#fbbf24', tagline: 'Зарплату відбили' },
    'Хіт': { emoji: '🔥', color: '#fb923c', tagline: 'Радіо крутить, фанати верещать!' },
    'Культовий шедевр': { emoji: '🏆', color: '#22c55e', tagline: 'Про це писатимуть у підручниках!' },
  }[result.successType]

  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        className="mx-auto mb-6 w-full max-w-md rounded-3xl border-2 bg-studio-800/80 p-6 text-center shadow-glow"
        style={{ borderColor: meta.color, boxShadow: `0 0 60px -10px ${meta.color}66` }}
      >
        <div className="text-6xl">{meta.emoji}</div>
        <h2 className="mt-2 font-display text-3xl" style={{ color: meta.color }}>{result.successType}</h2>
        <p className="mt-1 text-sm text-zinc-400">{meta.tagline}</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <ResultBox emoji="🎧" label="Слухачі" value={formatNumber(result.listeners)} />
        <ResultBox emoji="❤️" label="Фани" value={formatSigned(result.fans)} color={result.fans >= 0 ? '#22c55e' : '#ef4444'} />
        <ResultBox emoji="💰" label="Прибуток" value={formatMoney(result.money)} color={result.money >= 0 ? '#22c55e' : '#ef4444'} />
        <ResultBox emoji="🎵" label="Токени" value={`+${result.tokens}`} color="#22c55e" />
      </div>

      <div className="space-y-2 mb-6">
        {result.events.map((ev, i) => (
          <div key={`ev-${i}`} className="rounded-2xl border border-studio-600 bg-studio-800/60 p-3 text-sm text-zinc-200">
            📰 {ev}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="primary" onClick={endWeek}>⏭ Завершити тиждень</Button>
      </div>
    </div>
  )
}

function ResultBox({ emoji, label, value, color }: { emoji: string; label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-studio-600 bg-studio-800/70 p-3 text-center">
      <div className="text-xl">{emoji}</div>
      <div className="text-[10px] uppercase text-zinc-500">{label}</div>
      <div className="font-display text-lg tabular-nums" style={{ color: color ?? '#fff' }}>{value}</div>
    </div>
  )
}
