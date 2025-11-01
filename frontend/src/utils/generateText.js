const WORD_LIST = [
  "nottingham", "wedding", "abbey", "tithe", "barn", "ash", "becky",
  "harry", "potter", "keyboard", "coffee", "printing", "ceramic", "the",
  "open", "around", "but", "after", "fact", "most", "high", "own", "into",
  "much", "right", "need", "people", "penelope", "oscar", "formula",
  "world", "singapore", "phuket", "maldives", "richmond", "skipton",
  "castleford", "trent", "beer", "bangkok", "cyprus", "here", "govern",
  "way", "part", "public", "mean", "more", "help", "without", "love",
  "vows", "off", "erhu", "guzheng", "party", "she", "time", "before",
  "number", "physics", "little", "good", "man", "dog", "interest",
  "well", "change", "turn", "dungeon", "dragon", "peak", "mine", "those",
  "music", "even", "that", "this", "where", "matter", "do", "one",
  "general", "air", "force", "eye", "person", "become", "wife", "husband",
  "partner", "use", "few", "of", "at", "or", "out", "up", "play", "point",
  "while", "last", "some", "we", "begin", "could", "tell", "system",
  "now", "order", "look", "problem", "they", "may", "end", "such", "james",
  "you", "because", "present", "like", "run", "again", "early", "come",
  "move", "nation", "know", "late", "program", "place", "also", "find",
  "toothless", "merida", "tangled", "demon", "hunter", "hops", "spell"
];

/**
 * Generates a random string of words from the list.
 * - Avoids using any word that appeared in the last 10 outputs.
 * @param {number} count - Number of words to include (default 50)
 * @returns {string} Randomly generated space-separated words
 */
export function generateRandomText(count = 50) {
  if (count <= 0 || WORD_LIST.length === 0) return "";

  const RECENT_WINDOW = 20;
  const words = [];
  const recent = [];

  for (let i = 0; i < count; i++) {
    // Fast path: if there is only one word, just use it
    if (WORD_LIST.length === 1) {
      words.push(WORD_LIST[0]);
      // Maintain recent window
      recent.push(WORD_LIST[0]);
      if (recent.length > RECENT_WINDOW) recent.shift();
      continue;
    }

    const recentSet = new Set(recent);
    let candidates = WORD_LIST.filter((w) => !recentSet.has(w));

    // Fallback: if everything is in recent, allow all words again
    if (candidates.length === 0) {
      candidates = WORD_LIST.slice();
    }

    const idx = Math.floor(Math.random() * candidates.length);
    const word = candidates[idx];

    words.push(word);
    recent.push(word);
    if (recent.length > RECENT_WINDOW) recent.shift();
  }
  return words.join(" ");
}
