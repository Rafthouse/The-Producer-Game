import type { ReactNode } from 'react'
import { useGameStore } from '../store/useGameStore'
import { formatMoney, formatNumber } from '../lib/format'

function StatChip({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-studio-600 bg-studio-800/70 px-3 py-1.5 backdrop-blur">
      <span className="text-lg leading-none">{emoji}</span>
      <div className="leading-tight">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
        <div className="font-display text-sm text-white tabular-nums">{value}</div>
      </div>
    </div>
  )
}

function Equalizer() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-40 items-end justify-center gap-1.5 opacity-20">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 origin-bottom rounded-t bg-gradient-to-t from-orange-500 to-amber-400 animate-equalize"
          style={{
            height: `${30 + ((i * 37) % 70)}%`,
            animationDelay: `${(i % 7) * 0.12}s`,
            animationDuration: `${0.7 + (i % 5) * 0.18}s`,
          }}
        />
      ))}
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const label = useGameStore((s) => s.label)

  return (
    <div className="relative flex min-h-full flex-col">
      {/* Фонові декорації студії */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[14px] border-studio-700/60 animate-spin-slow">
        <div className="absolute inset-8 rounded-full border-4 border-studio-600/50" />
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/40" />
      </div>
      <Equalizer />

      {/* Шапка */}
      <header className="relative z-10 border-b border-studio-700/70 bg-studio-900/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💿</span>
            <div className="leading-tight">
              <h1 className="font-display text-lg text-white">
                PRODUCER <span className="text-amber-400">TYCOON</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                ваш музичний лейбл
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatChip emoji="💰" label="Баланс" value={formatMoney(label.money)} />
            <StatChip emoji="❤️" label="Фани" value={formatNumber(label.fans)} />
            <StatChip emoji="📀" label="Релізи" value={`${label.releases}`} />
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:py-10">
        {children}
      </main>

      <footer className="relative z-10 px-4 py-4 text-center text-xs text-zinc-600">
        Producer Tycoon · v0.1 · сатиричний симулятор музичного продюсера
      </footer>
    </div>
  )
}
