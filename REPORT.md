# REPORT — Аудит та виправлення v0.3

## 1. Причина бага «зникають вкладки»

### Першопричина
У функції `signArtist` було встановлено `currentArtist: signedArtist` одразу після підписання:

```ts
// useGameStore.ts — signArtist (ДО)
set({
  currentArtist: signedArtist,  // ← БАГ
  artists: [...state.artists, signedArtist],
  ...
})
```

Через це TabStudio одразу перемикалася на `StudioRecording` замість того, щоб показати список артистів. Користувач натискав "Back", `currentArtist` очищався — але при перемиканні вкладок і поверненні `currentArtist` вже не був, проте `result` залишався.

### Другорядна причина
Функція `setTab` не очищала `result`. Після релізу:
1. `release()` встановлює `result`
2. Користувач бачить `StudioResult`
3. Перемикається на Label/World → повертається на Studio
4. `result` все ще встановлений → `StudioResult` рендериться ЗНОВУ
5. Користувач натискає "End Week" вдруге → `endWeek` виконується повторно

### Захист
Додано прапорець `_weekAdvanced`:
- `endWeek` встановлює `_weekAdvanced = true` і перевіряє його на початку
- `release` скидає `_weekAdvanced = false`
- Захист від подвійного виклику зі старої `StudioResult` після перемикання вкладок

---

## 2. Що виправлено

### Баги
- `signArtist` більше не встановлює `currentArtist` (файл: `useGameStore.ts:115`)
- `setTab` очищає `result` при виході зі Studio (файл: `useGameStore.ts:122`)
- Додано `_weekAdvanced` — захист від подвійного `endWeek` (файл: `useGameStore.ts:380-383`)
- `endWeek` перевіряє `_weekAdvanced` на початку, пропускає якщо вже виконано

### Архітектурні зміни
- Zustand store: додано `_weekAdvanced: boolean`
- Ініціалізовано в `startGame()`, `restart()`, та в початковому стані

---

## 3. Які формули змінено

### calculateRelease.ts
**До:**
```
base = talent×0.25 + charisma×0.15 + popularity×0.10 + discipline×0.10
      + reputation×0.05 + selfConfidence×0.05 - addiction×0.15
luck = randInt(-15, 40)  // 55 пунктів випадковості!
```

**Після:**
```
base = talent×0.35 + charisma×0.20 + popularity×0.10 + discipline×0.10
      + reputation×0.05 + selfConfidence×0.02 - addiction×0.15
luck = randInt(-8, 8)    // 16 пунктів випадковості (в 3.4× менше)
```

Розподіл впливу: **70% статистика** → **15% бонуси** → **10% контекст** → **5% рандом**

### calculateTour.ts
**До:**
```
base = popularity×0.30 + charisma×0.15 + genreTrend×0.20 + managerBonus×0.50
luck = randInt(-15, 25)
healthPenalty = health<40 ? (40-health)×0.3 : 0
```

**Після:**
```
base = popularity×0.30 + charisma×0.15 + reputation×0.10
      + genreTrend×0.15 + managerBonus×0.25
luck = randInt(-12, 12)
healthPenalty = health<40 ? (40-health)×0.25 : 0
```

Додано `reputation` в формулу. Зменшено luck з 40 до 24 пунктів.

---

## 4. Які механіки перебалансовано

### Спеціалізації продюсера
| Спеціалізація | Ефект | Опис |
|:---|:---|---|
| Талановитий | `qualityBonus` | +5% якості, +2%/рівень |
| Діляга | `profitBonus` | +5% прибутку, +3%/рівень |
| Метр | `scandalReduction` | -10% скандалів, -2%/рівень |
| Психолог | `happinessBonus` | +10% щастя, +2%/рівень |
| Аферист | `riskProfitBonus` | +15% прибутку, -5% репутації |

Кожен ефект тепер масштабується від рівня продюсера через `levelMult = 1 + (level - 1) * 0.1`.

### Генерація артистів
- **Середній рівень**: 40-60 (було 35-65)
- **stddev**: зменшено з 15 до 12
- **Жанрові зсуви**: макс ±8 (було ±15)
- **Усі бази clamp**: 10-90

### Тренди
- **Макс зміна популярності теми**: ±5/тиждень (було ±8)
- **Жанри**: макс ±5/тиждень від попереднього значення
- **Вплив трендів**: зменшено коефіцієнти (1-2 замість 1.5-3)

### Релізи
- Зменшено випадковість в 3.4 рази (luck: -15..40 → -8..8)
- Підвищено вагу таланту (25% → 35%)
- Підвищено вагу харизми (15% → 20%)
- `tierFromScore` thresholds зсунуто: тепер 25-50-75-100 (було 20-45-70-95)
- Успішність сильніше залежить від реальних статів артиста

### Тури
- Додано `reputation` (10%) в формулу
- Зменшено luck з 40 до 24 пунктів
- Зменшено штраф здоров'я
- При невдачі: менше revenue/popularity коефіцієнти
