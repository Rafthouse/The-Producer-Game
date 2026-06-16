import { motion } from 'framer-motion'
import type { Artist } from '../types/game'
import { StatBar } from './StatBar'

interface Props {
  artist: Artist
  compact?: boolean
}

export function ArtistCard({ artist, compact = false }: Props) {
  const { genre } = artist

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full overflow-hidden rounded-3xl border border-studio-600 bg-studio-800/80 p-4 shadow-glow"
        style={{ boxShadow: `0 0 30px -8px ${genre.accent}44` }}
      >
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: genre.accent }} />
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${genre.accent}22`, boxShadow: `inset 0 0 0 2px ${genre.accent}44` }}
          >{genre.emoji}</div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg text-white">{artist.name}</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span style={{ color: genre.accent }}>{genre.role}</span>
              <span>· {artist.age} р.</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatBar label="Талант" value={artist.talent} emoji="🎯" />
          <StatBar label="Харизма" value={artist.charisma} emoji="✨" />
          <StatBar label="Популярність" value={artist.popularity} emoji="📈" />
          <StatBar label="Залежність" value={artist.addiction} emoji="🍾" invert />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative w-full overflow-hidden rounded-3xl border border-studio-600 bg-studio-800/80 p-6 shadow-glow backdrop-blur"
      style={{ boxShadow: `0 0 50px -12px ${genre.accent}55` }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: genre.accent }} />

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

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <StatBar label="Талант" value={artist.talent} emoji="🎯" />
        <StatBar label="Харизма" value={artist.charisma} emoji="✨" />
        <StatBar label="Дисципліна" value={artist.discipline} emoji="⏰" />
        <StatBar label="Популярність" value={artist.popularity} emoji="📈" />
        <StatBar label="Здоров'я" value={artist.health} emoji="💪" />
        <StatBar label="Залежність" value={artist.addiction} emoji="🍾" invert />
      </div>

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
