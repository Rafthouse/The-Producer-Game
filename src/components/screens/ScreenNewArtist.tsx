import { AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { ArtistCard } from '../ArtistCard'
import { Button } from '../ui/Button'

export function ScreenNewArtist() {
  const artistPair = useGameStore((s) => s.artistPair)
  const signArtist = useGameStore((s) => s.signArtist)
  const rejectBoth = useGameStore((s) => s.rejectBoth)
  const rejectedThisWeek = useGameStore((s) => s.rejectedThisWeek)
  const artists = useGameStore((s) => s.artists)

  if (!artistPair) return null

  const [first, second] = artistPair

  const handleSign = (index: 0 | 1) => {
    signArtist(index)
  }

  const handleRejectBoth = () => {
    rejectBoth()
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Нові артисти</p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
          Оберіть, кого підписати
        </h2>
        {artists.length > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            Підписано артистів: {artists.length}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          <ArtistCard key={first.id} artist={first} />
          <ArtistCard key={second.id} artist={second} />
        </AnimatePresence>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button variant="primary" onClick={() => handleSign(0)} className="w-full">
          ✍️ Першого
        </Button>
        <Button variant="primary" onClick={() => handleSign(1)} className="w-full">
          ✍️ Другого
        </Button>
        <Button variant="danger" onClick={handleRejectBoth} className="w-full">
          🚪 Відмовити обом
        </Button>
      </div>

      {rejectedThisWeek > 0 && (
        <p className="mt-3 text-center text-xs text-zinc-500">
          Відхилено артистів за цей тиждень: {rejectedThisWeek}
        </p>
      )}
    </div>
  )
}
