const WORD_POOL = [
  // Short (2-5 chars)
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "but",
  "his", "by", "from", "they", "we", "her", "she", "or", "an", "will",
  "my", "one", "all", "there", "what", "so", "up", "out", "if", "about",
  "who", "get", "make", "go", "can", "like", "time", "no", "just", "him",
  "know", "take", "come", "than", "look", "only", "into", "year", "back",
  "new", "now", "way", "may", "day", "too", "any", "say", "each", "tell",
  "set", "want", "well", "put", "old", "big", "ask", "use", "try", "own",
  // Medium (5-8 chars)
  "think", "after", "other", "which", "their", "about", "these", "would",
  "people", "write", "first", "water", "could", "right", "place", "world",
  "never", "great", "still", "house", "every", "found", "under", "night",
  "learn", "point", "might", "being", "where", "begin", "while", "light",
  "small", "group", "start", "black", "money", "story", "power", "music",
  "stand", "state", "large", "close", "above", "watch", "often", "young",
  "paper", "table", "early", "reach", "along", "human", "plant", "drive",
  "clear", "voice", "space", "quick", "brown", "green", "field", "study",
  "build", "block", "chain", "trust", "order", "proof", "type", "play",
  // Long (8+ chars)
  "together", "children", "important", "possible", "different", "between",
  "anything", "national", "remember", "question", "continue", "thousand",
  "computer", "keyboard", "protocol", "generate", "movement", "standard",
  "research", "practice", "building", "security", "complete", "discover",
  "language", "consider", "software", "internet", "powerful", "creative",
  "thinking", "original", "progress", "previous", "mountain", "tomorrow",
  "terminal", "function", "transfer", "abstract", "learning", "exchange",
  "yourself", "everyone", "probably", "document",
];

export interface GeneratedChallenge {
  text: string;
  words: string[];
}

export function generateChallenge(): GeneratedChallenge {
  const words: string[] = [];
  for (let i = 0; i < 150; i++) {
    words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return { text: words.join(" "), words };
}
