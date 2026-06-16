import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { ArtistCard } from '../ArtistCard'
import { Button } from '../ui/Button'
import { formatMoney, formatNumber, formatSigned } from '../../lib/format'
import { analyzeText, calculateTextFit, TOPIC_LABELS } from '../../lib/analyzeText'
import type { TextTopic } from '../../lib/analyzeText'
import { generateLyricsFromPrompt } from '../../lib/generateLyrics'

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

      {/* Налаштування AI */}
      <AiSettingsPanel />
    </div>
  )
}

function AiSettingsPanel() {
  const aiApiKey = useGameStore((s) => s.aiApiKey)
  const setAiApiKey = useGameStore((s) => s.setAiApiKey)
  const [showSettings, setShowSettings] = useState(false)
  const [keyInput, setKeyInput] = useState(aiApiKey)

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        {showSettings ? '🔽 Сховати' : '⚙️ Налаштування генерації музики'}
      </button>
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-2xl border border-studio-600 bg-studio-800/70 p-4"
          >
            <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-2">🤖 Hugging Face Inference API</p>
            <p className="text-[11px] text-zinc-500 mb-2">
              Вставте ваш Hugging Face токен, щоб генерувати аудіо до релізів
              (безкоштовно, ліміт ~300 запитів/год).
              Якщо не налаштовано — звук буде синтезований програмно.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="hf_xxxxxxxxxxxx..."
                className="flex-1 rounded-xl border border-studio-600 bg-studio-900/70 px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
              />
              <button
                onClick={() => setAiApiKey(keyInput)}
                className="rounded-xl bg-amber-500/20 border border-amber-600/30 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/30 transition-colors"
              >Зберегти</button>
            </div>
            {aiApiKey && (
              <p className="mt-2 text-[10px] text-green-500">✅ Токен збережено ({aiApiKey.slice(0, 12)}...)</p>
            )}
            <p className="mt-2 text-[10px] text-zinc-600">
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                Отримати токен
              </a>
               (безкоштовно, реєстрація на huggingface.co)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
  const overtonWindow = useGameStore((s) => s.overtonWindow)

  // Режим: 'generated' або 'custom'
  const [mode, setMode] = useState<'generated' | 'custom'>('generated')
  const [customText, setCustomText] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  // Промпт для генерації
  const [prompt, setPrompt] = useState(artist.lyricsPrompt || '')
  const [currentLyrics, setCurrentLyrics] = useState(artist.songText)

  // Аналізуємо текст (генерований або кастомний)
  const textToAnalyze = mode === 'custom' && customText.trim()
    ? customText
    : currentLyrics
  const analysis = analyzeText(textToAnalyze)
  const overtonForAnalysis = overtonWindow.map((ow) => ({
    topic: ow.topic as TextTopic,
    popularity: ow.popularity,
  }))
  const fit = calculateTextFit(analysis, artist.genre.id, artist.archetype, overtonForAnalysis)

  const isValidCustom = customText.trim().split('\n').filter(Boolean).length >= 4
    && customText.length <= 2000

  // Оновлюємо текст артиста перед релізом
  const handleRelease = () => {
    if (mode === 'generated') {
      useGameStore.setState({ currentArtist: { ...artist, songText: currentLyrics, lyricsPrompt: prompt } })
    } else if (mode === 'custom' && isValidCustom) {
      useGameStore.setState({ currentArtist: { ...artist, songText: customText } })
    }
    onRelease()
  }

  // Регенерація тексту за промптом
  const regenerate = () => {
    const newLyrics = generateLyricsFromPrompt(prompt, artist.genre.id)
    setCurrentLyrics(newLyrics)
  }

  // Теми з ненульовим значенням
  const activeTopics = Object.entries(analysis.topics)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto pr-1">
      <div className="mb-5 text-center flex-shrink-0">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Студія</p>
        <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">Запис синглу</h2>
        <p className="mt-1 text-xs text-zinc-500">🎵 {tokens} · Вартість: 1 🎵</p>
      </div>

      {/* Профіль артиста */}
      <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-5 shadow-glow flex-shrink-0"
        style={{ boxShadow: `0 0 50px -12px ${genre.accent}55` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${genre.accent}22`, boxShadow: `inset 0 0 0 2px ${genre.accent}55` }}
          >{genre.emoji}</div>
          <div>
            <div className="font-display text-lg text-white">{artist.name}</div>
            <div className="text-xs text-zinc-400">{genre.emoji} {genre.role}</div>
          </div>
        </div>
        <div className="text-center mb-3">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Трек</p>
          <p className="mt-1 font-display text-xl" style={{ color: genre.accent }}>«{artist.trackTitle}»</p>
        </div>

        {/* Вибір режиму */}
        <div className="flex gap-1 rounded-xl border border-studio-600 bg-studio-700/60 p-0.5 mb-3">
          <button
            onClick={() => setMode('generated')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-display transition-all ${
              mode === 'generated'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >🤖 Згенерувати текст</button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-display transition-all ${
              mode === 'custom'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >✍️ Написати свій</button>
        </div>

        {/* Режим: згенерований текст */}
        {mode === 'generated' && (
          <div>
            {/* Промпт */}
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Промпт</p>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Опиши тему пісні... любов, протест, алкоголь, абсурд, село..."
                  className="flex-1 rounded-xl border border-studio-600 bg-studio-900/70 px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  onClick={regenerate}
                  className="rounded-xl bg-amber-500/20 border border-amber-600/30 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/30 transition-colors"
                >🔄</button>
              </div>
            </div>
            {/* Текст */}
            <div className="rounded-2xl border border-studio-600 bg-studio-900/70 p-4">
              <p className="whitespace-pre-line text-center text-sm italic leading-relaxed text-zinc-300">
                {currentLyrics}
              </p>
            </div>
          </div>
        )}

        {/* Режим: написати свій текст */}
        {mode === 'custom' && (
          <div>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Введіть текст пісні... має бути мінімум 4 рядки, до 2000 символів"
              className="w-full min-h-[120px] rounded-2xl border border-studio-600 bg-studio-900/70 p-4 text-sm text-zinc-300 placeholder-zinc-600 resize-y focus:outline-none focus:border-amber-500/50"
              maxLength={2000}
            />
            <div className="flex justify-between mt-1 text-[10px]">
              <span className={customText.trim().split('\n').filter(Boolean).length >= 4 ? 'text-green-500' : 'text-red-400'}>
                {customText.trim().split('\n').filter(Boolean).length}/4 рядків
              </span>
              <span className={customText.length <= 2000 ? 'text-green-500' : 'text-red-400'}>
                {customText.length}/2000 символів
              </span>
            </div>
          </div>
        )}

        {/* Кнопка аналізу / приховати аналіз */}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {showAnalysis ? '🔽 Сховати аналіз' : '📊 Показати аналіз тексту'}
          </button>
        </div>
      </div>

      {/* ЗВІТ АНАЛІЗУ */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 overflow-hidden flex-shrink-0"
          >
            {/* Теми тексту */}
            <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-4">
              <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-2">📝 Аналіз тексту</p>
              <div className="space-y-1">
                {activeTopics.map(([topic, val]) => (
                  <div key={topic} className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 w-24">{TOPIC_LABELS[topic as TextTopic] ?? topic}</span>
                    <div className="flex-1 h-2 rounded-full bg-studio-600 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 w-6 text-right">{val}</span>
                  </div>
                ))}
                {activeTopics.length === 0 && (
                  <p className="text-xs text-zinc-600 italic">Текст не містить розпізнаних тем</p>
                )}
              </div>
            </div>

            {/* Відповідність */}
            <div className="rounded-3xl border border-studio-600 bg-studio-800/80 p-4">
              <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-2">🎯 Відповідність</p>
              <div className="grid grid-cols-2 gap-2">
                <FitBar label="Артисту" value={fit.artistFit} color="#22c55e" />
                <FitBar label="Трендам" value={fit.trendFit} color="#06b6d4" />
                <FitBar label="Шанс скандалу" value={fit.scandalChance} color={fit.scandalChance > 50 ? '#ef4444' : '#fbbf24'} />
                <FitBar label="Шанс вірусності" value={fit.viralChance} color={fit.viralChance > 50 ? '#a855f7' : '#94a3b8'} />
                <FitBar label="Кринж" value={fit.cringe} color={fit.cringe > 60 ? '#f97316' : '#78716c'} />
                {fit.memePotential > 0 && (
                  <FitBar label="Мем-потенціал" value={fit.memePotential} color="#ec4899" />
                )}
              </div>
              {fit.details.likes.length > 0 && (
                <p className="mt-2 text-[10px] text-green-500">
                  👍 Сподобається: {fit.details.likes.map((t) => TOPIC_LABELS[t as TextTopic]).join(', ')}
                </p>
              )}
              {fit.details.hates.length > 0 && (
                <p className="text-[10px] text-red-400">
                  👎 Не сподобається: {fit.details.hates.map((t) => TOPIC_LABELS[t as TextTopic]).join(', ')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопки дій */}
      <div className="mt-5 flex justify-center flex-col items-center gap-3 flex-shrink-0 pb-4">
        {!canRelease && <p className="text-xs text-red-400">Недостатньо токенів!</p>}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>← Назад</Button>
          <Button
            variant="primary"
            onClick={handleRelease}
            disabled={!canRelease || (mode === 'custom' && !isValidCustom)}
          >
            🎙️ Випустити (1 🎵)
          </Button>
        </div>
      </div>
    </div>
  )
}

function FitBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl bg-studio-700/40 p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-zinc-500">{label}</span>
        <span className="text-[10px] font-display tabular-nums" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-studio-600">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function StudioResult() {
  const result = useGameStore((s) => s.result)
  const endWeek = useGameStore((s) => s.endWeek)
  const audioData = useGameStore((s) => s.audioData)
  const audioMimeType = useGameStore((s) => s.audioMimeType)
  const isGeneratingAudio = useGameStore((s) => s.isGeneratingAudio)

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

      {/* Програвач */}
      {isGeneratingAudio ? (
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-600/30 px-4 py-2 text-sm text-amber-400">
            <span className="animate-pulse">🎵</span>
            <span>Генеруємо музику...</span>
          </div>
        </div>
      ) : audioData ? (
        <div className="text-center mb-4">
          <audio
            key={audioData}
            controls
            autoPlay
            className="mx-auto w-full max-w-sm h-10 rounded-xl"
            src={`data:${audioMimeType};base64,${audioData}`}
          />
        </div>
      ) : null}

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
