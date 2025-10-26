const WORD_LIST = [
  "nottingham", "wedding", "bolton", "abbey", "tithe", "barn", "ash",
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
  "now", "order", "look", "problem", "they", "may", "end", "such",
  "you", "because", "present", "like", "run", "again", "early", "come",
  "move", "nation", "know", "late", "program", "place", "also", "find",
  "toothless", "merida", "tangled", "demon", "hunter", "hops", "spell"
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
