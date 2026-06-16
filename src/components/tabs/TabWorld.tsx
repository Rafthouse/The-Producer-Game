import { useGameStore } from '../../store/useGameStore'

/**
 * Вкладка 3: Світ
 * Новини · Чарти · Вікна Овертона · Тренди
 */
export function TabWorld() {
  const news = useGameStore((s) => s.news)
  const overtonWindow = useGameStore((s) => s.overtonWindow)
  const trends = useGameStore((s) => s.trends)
  const genreTrends = useGameStore((s) => s.genreTrends)
  const popularTopics = overtonWindow.filter((t) => t.popularity > 50).sort((a, b) => b.popularity - a.popularity)
  const unpopularTopics = overtonWindow.filter((t) => t.popularity <= 50).sort((a, b) => a.popularity - b.popularity)

  return (
    <div className="flex flex-1 flex-col space-y-6">
      {/* Новини */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">📰 Новини тижня</h3>
        <div className="space-y-2">
          {news.map((item) => {
            const borderColor = item.type === 'trend' ? 'border-amber-700/40 bg-amber-900/10'
              : item.type === 'world' ? 'border-blue-700/40 bg-blue-900/10'
              : 'border-purple-700/40 bg-purple-900/10'
            return (
              <div key={item.id} className={`rounded-2xl border p-3 ${borderColor}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <div className="font-display text-sm text-white">{item.title}</div>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Тренди жанрів */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🎵 Популярність жанрів</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {genreTrends.map((gt) => {
            const barWidth = Math.abs(gt.popularityMod)
            const isPositive = gt.popularityMod >= 0
            return (
              <div key={gt.genreId} className="rounded-xl bg-studio-700/40 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white font-display">{gt.genreId}</span>
                  <span className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{gt.popularityMod}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-studio-600">
                  <div
                    className={`h-full rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${barWidth * 5}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Вікна Овертона */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">🌐 Вікна Овертона</h3>

        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Сьогодні популярні</p>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((t) => (
              <div key={t.topic} className="rounded-xl bg-green-900/20 border border-green-700/30 px-3 py-1.5 text-xs text-green-300">
                {t.emoji} {t.name} <span className="text-green-500">{t.popularity}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Непопулярні</p>
          <div className="flex flex-wrap gap-2">
            {unpopularTopics.map((t) => (
              <div key={t.topic} className="rounded-xl bg-red-900/10 border border-red-700/20 px-3 py-1.5 text-xs text-red-300">
                {t.emoji} {t.name} <span className="text-red-500">{t.popularity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Детальні тренди */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5">
        <h3 className="font-display text-lg text-white mb-3">📊 Динаміка трендів</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {trends.map((t) => (
            <div key={t.topic} className="rounded-xl bg-studio-700/40 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{t.emoji}</span>
                  <span className="text-xs text-white">{t.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{t.popularity}%</span>
                  <span className={`text-xs ${
                    t.direction === 'rising' ? 'text-green-400' :
                    t.direction === 'falling' ? 'text-red-400' : 'text-zinc-500'
                  }`}>
                    {t.direction === 'rising' ? '↑' : t.direction === 'falling' ? '↓' : '→'}
                  </span>
                </div>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-studio-600">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${t.popularity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
