import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'
import { StatBar } from '../StatBar'

export function ScreenRelease() {
  const currentArtist = useGameStore((s) => s.currentArtist)
  const artists = useGameStore((s) => s.artists)
  const release = useGameStore((s) => s.release)
  const tokens = useGameStore((s) => s.label.tokens)
  const fireArtist = useGameStore((s) => s.fireArtist)

  if (!currentArtist) {
    // Немає поточного — показуємо список артистів для вибору
    return (
      <div className="flex flex-1 flex-col">
        <div className="mb-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Студія</p>
          <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
            Оберіть артиста для запису
          </h2>
        </div>

        <div className="space-y-3">
          {artists.map((a) => (
            <motion.div
              key={a.id}
              className="rounded-2xl border border-studio-600 bg-studio-800/80 p-4"
              style={{ boxShadow: `0 0 30px -10px ${a.genre.accent}44` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg text-white">{a.name}</div>
                  <div className="text-xs text-zinc-400">
                    {a.genre.emoji} {a.genre.role} · Популярність: {a.popularity}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      useGameStore.setState({ currentArtist: a })
                    }}
                    className="text-sm px-4 py-2"
                  >
                    🎙️
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => fireArtist(a.id)}
                    className="text-sm px-4 py-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => useGameStore.getState().endWeek()}
            className="text-sm"
          >
            ⏭ Завершити тиждень
          </Button>
        </div>
      </div>
    )
  }

  const { genre } = currentArtist
  const canRelease = tokens >= 1

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Студія звукозапису
        </p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
          Запис синглу
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          🎵 Токенів: {tokens} · Вартість: 1 🎵
        </p>
      </div>

      <div
        className="rounded-3xl border border-studio-600 bg-studio-800/80 p-6 shadow-glow"
        style={{ boxShadow: `0 0 50px -12px ${genre.accent}55` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${genre.accent}22`, boxShadow: `inset 0 0 0 2px ${genre.accent}55` }}
          >
            {genre.emoji}
          </div>
          <div>
            <div className="font-display text-xl text-white">{currentArtist.name}</div>
            <div className="text-sm text-zinc-400">
              {genre.emoji} {genre.role}
            </div>
          </div>
        </div>

        {/* Стати артиста */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          <StatBar label="Талант" value={currentArtist.talent} emoji="🎯" />
          <StatBar label="Харизма" value={currentArtist.charisma} emoji="✨" />
          <StatBar label="Дисципліна" value={currentArtist.discipline} emoji="⏰" />
          <StatBar label="Популярність" value={currentArtist.popularity} emoji="📈" />
          <StatBar label="Здоров'я" value={currentArtist.health} emoji="💪" />
          <StatBar label="Щастя" value={currentArtist.happiness} emoji="😊" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Назва треку</p>
          <p className="mt-1 font-display text-2xl sm:text-3xl" style={{ color: genre.accent }}>
            «{currentArtist.trackTitle}»
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-studio-600 bg-studio-900/70 p-5">
          <p className="whitespace-pre-line text-center font-medium italic leading-relaxed text-zinc-200">
            {currentArtist.songText}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-col items-center gap-3">
        {!canRelease && (
          <p className="text-xs text-red-400">Недостатньо токенів! Завершіть тиждень, щоб отримати більше 🎵</p>
        )}
        <Button
          variant="primary"
          onClick={release}
          disabled={!canRelease}
          className="w-full text-lg sm:w-auto sm:px-12"
        >
          🎙️ Випустити сингл (1 🎵)
        </Button>
        <Button
          variant="ghost"
          onClick={() => useGameStore.getState().endWeek()}
          className="text-sm"
        >
          ⏭ Завершити тиждень
        </Button>
      </div>
    </div>
  )
}
