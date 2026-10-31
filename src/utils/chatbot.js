// Minuscules, sans accents ni ponctuation, découpé en mots.
export function tokenize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

// Intention dont les mots-clés correspondent le plus au message, ou null.
export function findIntent(message, intents) {
  const words = tokenize(message)
  let best = null
  let bestScore = 0

  for (const intent of intents) {
    const score = intent.keywords.filter((keyword) =>
      words.some((word) => word === keyword || (keyword.length > 4 && word.startsWith(keyword))),
    ).length
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return best
}
