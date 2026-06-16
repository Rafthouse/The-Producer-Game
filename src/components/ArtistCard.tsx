import { motion } from 'framer-motion'
import type { Artist } from '../types/game'
import { StatBar } from './StatBar'

export function ArtistCard({ artist }: { artist: Artist }) {
  const { genre } = artist

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative w-full overflow-hidden rounded-3xl border border-studio-600 bg-studio-800/80 p-6 shadow-glow backdrop-blur"
      style={{ boxShadow: `0 0 50px -12px ${genre.accent}55` }}
    >
      {/* Акцентна смуга жанру */}
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: genre.accent }} />

      {/* Шапка */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundColor: `${genre.accent}22`, boxShadow: `inset 0 0 0 2px ${genre.accent}55` }}
        >
          {genre.emoji}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl leading-tight text-white sm:text-3xl">
            {artist.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <span
              className="rounded-full px-2.5 py-0.5 font-medium"
              style={{ backgroundColor: `${genre.accent}22`, color: genre.accent }}
            >
              {genre.emoji} {genre.role}
            </span>
            <span>· {artist.age} р.</span>
          </div>
        </div>
      </div>

      {/* Характеристики */}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <StatBar label="Харизма" value={artist.charisma} emoji="✨" />
        <StatBar label="Талант" value={artist.talent} emoji="🎯" />
        <StatBar label="Дисципліна" value={artist.discipline} emoji="⏰" />
        <StatBar label="Репутація" value={artist.reputation} emoji="🎖️" />
        <StatBar label="Залежність" value={artist.addiction} emoji="🍾" invert />
      </div>

      {/* Особливості */}
      <div className="mt-6">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Особливості
        </h3>
        <div className="flex flex-wrap gap-2">
          {artist.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-lg border border-studio-600 bg-studio-700/60 px-3 py-1 text-sm text-zinc-200"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Текст пісні */}
      <div className="mt-6">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Текст пісні
        </h3>
        <div className="rounded-2xl border border-studio-600 bg-studio-900/70 p-4">
          <p className="whitespace-pre-line font-medium italic leading-relaxed text-zinc-300">
            «{artist.songText}»
          </p>
        </div>
      </div>
    </motion.div>
  )
}
