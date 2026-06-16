/**
 * API для генерації музики через Hugging Face Serverless Inference
 * Використовує facebook/musicgen-small (безкоштовний, ~300 req/hour)
 * 
 * Альтернатива при недоступності: synth-генерація на клієнті
 */

// Можна використовувати новий router endpoint або старий
// Router endpoint підтримує стримінг та кращу сумісність
const HF_API_BASE = 'https://router.huggingface.co/hf-inference/models'
const HF_MODEL = 'facebook/musicgen-small'

export interface MusicGenResult {
  success: boolean
  audioBase64?: string
  /** mime type, зазвичай audio/flac або audio/wav */
  mimeType?: string
  error?: string
}

/**
 * Конвертує текст пісні + промпт в короткий семпл музики
 * @param apiKey — Hugging Face API токен
 * @param lyrics — текст пісні (до 2000 символів)
 * @param prompt — промпт для налаштування стилю
 * @param duration — тривалість в секундах (макс 30)
 */
export async function generateMusic(
  apiKey: string,
  lyrics: string,
  prompt: string,
  duration: number = 15,
): Promise<MusicGenResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { success: false, error: 'HF_API_KEY не налаштовано' }
  }

  try {
    // Обрізаємо lyrics до 500 символів (ліміт моделі)
    const lyricsTrimmed = lyrics.slice(0, 500)

    // Формуємо промпт з текстом
    // MusicGen приймає: текстове завдання
    const input = `${prompt}. Lyrics: ${lyricsTrimmed.replace(/\n/g, ' ')}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

    const response = await fetch(
      `${HF_API_BASE}/${HF_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: input,
          parameters: {
            duration: Math.min(duration, 30),
          },
        }),
        signal: controller.signal,
      }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      // Спробуємо прочитати помилку
      let errorMsg = `HTTP ${response.status}`
      try {
        const err = await response.json()
        if (err.error) errorMsg = err.error
      } catch {}
      return { success: false, error: errorMsg }
    }

    // Відповідь — аудіо-блоб
    const blob = await response.blob()
    const contentType = blob.type || 'audio/wav'

    // Конвертуємо в base64
    const buffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const audioBase64 = btoa(binary)

    return {
      success: true,
      audioBase64,
      mimeType: contentType,
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: false, error: 'Таймаут генерації (30с)' }
    }
    return { success: false, error: err?.message || 'Невідома помилка' }
  }
}

/**
 * Генерує короткий synth-семпл коли API недоступний
 * Створює простий WAV з випадковими частотами
 */
export function generateSynthPreview(genreId: string, durationSec: number = 10): string {
  const sampleRate = 22050
  const numSamples = sampleRate * durationSec
  const channels = 1
  const bitsPerSample = 16
  const byteRate = sampleRate * channels * bitsPerSample / 8
  const blockAlign = channels * bitsPerSample / 8
  const dataSize = numSamples * channels * bitsPerSample / 8
  const headerSize = 44
  const fileSize = headerSize + dataSize

  // Базові частоти по жанрах
  const baseFreqs: Record<string, number> = {
    punk: 180, rap: 70, pop: 120, folk: 160, bard: 140, electro: 100,
  }
  const freq = baseFreqs[genreId] || 120

  const buffer = new ArrayBuffer(fileSize)
  const view = new DataView(buffer)

  // WAV Header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, fileSize - 8, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // Дані: проста хвиля з випадковими модуляціями
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const env = Math.max(0, 1 - t / durationSec) * 0.3 // fade out
    // Основний тон + гармоніки + шум
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.4
    const harm = Math.sin(2 * Math.PI * freq * 2 * t) * 0.15
    const harm3 = Math.sin(2 * Math.PI * freq * 3 * t) * 0.05
    // LFO для пульсації
    const lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * t)
    // Випадковий шум (перкусія)
    const noise = (Math.random() - 0.5) * 0.05
    const sample = (tone + harm + harm3) * env * lfo + noise
    const clamped = Math.max(-1, Math.min(1, sample))
    const intSample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF
    view.setInt16(headerSize + i * 2, Math.round(intSample), true)
  }

  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}
