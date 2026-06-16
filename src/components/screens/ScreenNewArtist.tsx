import { AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { ArtistCard } from '../ArtistCard'
import { Button } from '../ui/Button'

export function ScreenNewArtist() {
  const artist = useGameStore((s) => s.artist)
  const sign = useGameStore((s) => s.sign)
  const reject = useGameStore((s) => s.reject)
  const rejected = useGameStore((s) => s.rejected)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Новий артист</p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
          До вас у студію хтось завітав…
        </h2>
      </div>

      <AnimatePresence mode="wait">
        <ArtistCard key={artist.id} artist={artist} />
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="primary" onClick={sign} className="w-full">
          ✍️ Підписати
        </Button>
        <Button variant="danger" onClick={reject} className="w-full">
          🚪 Відмовити
        </Button>
      </div>

      {rejected > 0 && (
        <p className="mt-3 text-center text-xs text-zinc-500">Відхилено артистів: {rejected}</p>
      )}
    </div>
  )
}
