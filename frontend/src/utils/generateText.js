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
  const words = Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[randomIndex];
  });
  return words.join(" ");
}