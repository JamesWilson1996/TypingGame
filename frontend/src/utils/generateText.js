const WORD_LIST = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
  "keyboard", "apple", "river", "music", "happy", "dream", "light",
  "moon", "cloud", "green", "mountain", "stone", "story", "winter",
  "summer", "fire", "water", "earth", "wind", "smile", "sleep",
  "time", "world", "school", "train", "ocean", "flower", "shadow",
  "window", "bridge", "heart", "night", "day", "dream", "color",
  "energy", "forest", "path", "road", "friend", "voice", "word"
];

/**
 * Generates a random string of words from the list.
 * @param {number} count - Number of words to include (default 50)
 * @returns {string} Randomly generated space-separated words
 */
export function generateRandomText(count = 50) {
  if (count <= 0 || WORD_LIST.length === 0) return "";

  // Ensure we don't repeat the same word consecutively
  const words = [];
  let prev = null;
  for (let i = 0; i < count; i++) {
    if (WORD_LIST.length === 1) {
      // Degenerate case: only one word available
      words.push(WORD_LIST[0]);
      prev = WORD_LIST[0];
      continue;
    }

    let word = null;
    // Pick until different from previous
    do {
      const idx = Math.floor(Math.random() * WORD_LIST.length);
      word = WORD_LIST[idx];
    } while (word === prev);

    words.push(word);
    prev = word;
  }
  return words.join(" ");
}
