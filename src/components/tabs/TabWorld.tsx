import { useGameStore } from '../../store/useGameStore'
import { formatNumber } from '../../lib/format'
import { GENRE_META } from '../../data/trends'

/**
 * Вкладка 3: Світ
 * Новини · Популярність жанрів · Чарти · Вікна Овертона
 *
 * Усі дані живуть автономно і оновлюються щотижня.
 */
export function TabWorld() {
  const news = useGameStore((s) => s.news)
  const genreTrends = useGameStore((s) => s.genreTrends)
  const overtonWindow = useGameStore((s) => s.overtonWindow)
  const trends = useGameStore((s) => s.trends)
  const artists = useGameStore((s) => s.artists)
  const calendar = useGameStore((s) => s.calendar)
  const label = useGameStore((s) => s.label)

  // Топ-5 артистів лейблу за популярністю
  const topArtists = [...artists].sort((a, b) => b.popularity - a.popularity).slice(0, 5)

  // Вікна Овертона: популярні vs непопулярні
  const popularTopics = [...overtonWindow].sort((a, b) => b.popularity - a.popularity).slice(0, 5)
  const nicheTopics = [...overtonWindow].sort((a, b) => a.popularity - b.popularity).slice(0, 4)

  const newsTypeColor = (type: string) => {
    switch (type) {
      case 'trend': return 'border-amber-700/40 bg-amber-900/10'
      case 'world': return 'border-blue-700/40 bg-blue-900/10'
      case 'artist': return 'border-purple-700/40 bg-purple-900/10'
      case 'label': return 'border-green-700/40 bg-green-900/10'
      default: return 'border-studio-600 bg-studio-800/60'
    }
  }

  return (
    <div className="flex flex-1 flex-col space-y-5">
      {/* ===== НОВИНИ ===== */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-white">📰 Новини тижня</h3>
          <span className="text-[10px] text-zinc-600">
            {calendar.week}/{calendar.month}/{calendar.year}
          </span>
        </div>
        <div className="space-y-2">
          {news.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4">Новини з'являться наприкінці тижня</p>
          ) : (
            news.map((item) => (
              <div key={item.id} className={`rounded-2xl border p-3 ${newsTypeColor(item.type)}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm text-white truncate">{item.title}</span>
                      <span className="text-[10px] text-zinc-600 uppercase whitespace-nowrap">{item.type}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== ПОПУЛЯРНІСТЬ ЖАНРІВ (0-100, змінюється щотижня) ===== */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🎵 Популярність жанрів</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {genreTrends.map((gt) => {
            const meta = GENRE_META[gt.genreId]
            const barColor = gt.popularity > 60 ? '#22c55e' : gt.popularity > 40 ? '#fbbf24' : '#ef4444'
            const trendIcon = gt.popularityMod > 3 ? '🔥' : gt.popularityMod > 0 ? '📈' : gt.popularityMod < -3 ? '❄️' : '➡️'

            return (
              <div key={gt.genreId} className="rounded-xl bg-studio-700/40 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{meta.emoji}</span>
                    <span className="text-sm text-white font-display">{meta.name}</span>
                    <span className="text-xs">{trendIcon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display tabular-nums" style={{ color: barColor }}>
                      {gt.popularity}%
                    </span>
                    {gt.popularityMod !== 0 && (
                      <span className={`text-[10px] ${gt.popularityMod > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {gt.popularityMod > 0 ? '+' : ''}{gt.popularityMod}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-studio-600">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${gt.popularity}%`,
                      backgroundColor: barColor,
                      boxShadow: `0 0 6px ${barColor}66`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-zinc-600">
                  <span>Тема: {gt.hotTopic}</span>
                  <span>Вплив: {gt.popularityMod > 0 ? '+' : ''}{gt.popularityMod}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ===== ВІКНА ОВЕРТОНА ===== */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🌐 Вікна Овертона</h3>
        <p className="text-[10px] text-zinc-600 mb-3">
          Які теми зараз у тренді. Це впливає на популярність жанрів і успіх релізів.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Популярні теми */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">
              🔥 Гарячі теми
            </p>
            <div className="space-y-1.5">
              {popularTopics.map((t) => {
                const trend = trends.find((tr) => tr.topic === t.topic)
                const dirIcon = trend?.direction === 'rising' ? '↑' : trend?.direction === 'falling' ? '↓' : '→'
                const dirColor = trend?.direction === 'rising' ? 'text-green-400'
                  : trend?.direction === 'falling' ? 'text-red-400' : 'text-zinc-500'
                return (
                  <div
                    key={t.topic}
                    className="flex items-center justify-between rounded-xl bg-green-900/15 border border-green-700/25 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>{t.emoji}</span>
                      <span className="text-xs text-green-200">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-green-400 tabular-nums">{t.popularity}%</span>
                      <span className={`text-xs ${dirColor}`}>{dirIcon}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Непопулярні теми */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
              ❄️ Нішеві теми
            </p>
            <div className="space-y-1.5">
              {nicheTopics.map((t) => {
                const trend = trends.find((tr) => tr.topic === t.topic)
                const dirIcon = trend?.direction === 'rising' ? '↑' : trend?.direction === 'falling' ? '↓' : '→'
                const dirColor = trend?.direction === 'rising' ? 'text-green-400'
                  : trend?.direction === 'falling' ? 'text-red-400' : 'text-zinc-500'
                return (
                  <div
                    key={t.topic}
                    className="flex items-center justify-between rounded-xl bg-red-900/10 border border-red-700/20 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>{t.emoji}</span>
                      <span className="text-xs text-red-200">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-red-400 tabular-nums">{t.popularity}%</span>
                      <span className={`text-xs ${dirColor}`}>{dirIcon}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ЧАРТ ЛЕЙБЛУ ===== */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">📊 Чарт лейблу</h3>
        <p className="text-[10px] text-zinc-600 mb-3">
          Топ артистів лейблу за популярністю
        </p>

        {topArtists.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center py-4">
            Підпишіть артистів, щоб побачити чарт
          </p>
        ) : (
          <div className="space-y-1.5">
            {topArtists.map((a, i) => {
              const rankColor = i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#52525b'
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl bg-studio-700/40 p-2.5"
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs"
                    style={{ backgroundColor: `${rankColor}22`, color: rankColor }}
                  >
                    #{i + 1}
                  </div>
                  <div className="text-lg">{a.genre.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white truncate">{a.name}</div>
                    <div className="text-[10px] text-zinc-500">
                      {a.genre.name} · 🎧 {a.popularity}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-400 tabular-nums">{a.localPop}</div>
                    <div className="text-[10px] text-zinc-600">лок.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-amber-400 tabular-nums">{a.nationalPop}</div>
                    <div className="text-[10px] text-zinc-600">нац.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-purple-400 tabular-nums">{a.globalPop}</div>
                    <div className="text-[10px] text-zinc-600">світ</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ===== ЗВЕДЕНА СТАТИСТИКА ===== */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">📈 Статистика світу</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="Всього фанів" value={formatNumber(label.fans)} emoji="❤️" />
          <StatBox label="Релізів" value={`${label.releases}`} emoji="📀" />
          <StatBox label="Артистів" value={`${artists.length}`} emoji="🎤" />
          <StatBox label="Тиждень" value={`${calendar.week}/${calendar.month}`} emoji="📅" />
        </div>
      </div>
    </div>
  )
}

function StatBox({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-studio-700/40 p-3 text-center">
      <div className="text-lg">{emoji}</div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</div>
      <div className="font-display text-base text-white mt-0.5">{value}</div>
    </div>
  )
}
