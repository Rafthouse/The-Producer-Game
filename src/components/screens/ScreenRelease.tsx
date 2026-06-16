import { useGameStore } from '../../store/useGameStore'
import { Button } from '../ui/Button'

export function ScreenRelease() {
  const artist = useGameStore((s) => s.artist)
  const release = useGameStore((s) => s.release)
  const { genre } = artist

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Студія звукозапису
        </p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
          Час записати дебютний сингл
        </h2>
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
            <div className="font-display text-xl text-white">{artist.name}</div>
            <div className="text-sm text-zinc-400">
              {genre.emoji} {genre.role}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Назва треку</p>
          <p className="mt-1 font-display text-2xl sm:text-3xl" style={{ color: genre.accent }}>
            «{artist.trackTitle}»
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-studio-600 bg-studio-900/70 p-5">
          <p className="whitespace-pre-line text-center font-medium italic leading-relaxed text-zinc-200">
            {artist.songText}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="primary"
          onClick={release}
          className="w-full text-lg sm:w-auto sm:px-12"
        >
          🎙️ Випустити сингл
        </Button>
      </div>
    </div>
  )
}
