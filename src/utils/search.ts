/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Stop words commonly found in perfume descriptions that add noise to searches
const STOP_WORDS = new Set([
  'de', 'da', 'do', 'dos', 'das', 'du', 'd', 'l', 'la', 'le',
  'pour', 'homme', 'for', 'men', 'woman', 'women', 'femme',
  'eau', 'parfum', 'toilette', 'edt', 'edp', 'cologne',
  'tipo', 'inspiracao', 'inspiração', 'contratipo', 'similar',
  'fragrancia', 'fragrância', 'essencia', 'essência', 'perfume'
]);

/**
 * Normalizes text by converting to lowercase, removing accents/diacritics,
 * stripping non-alphanumeric characters, and removing common stopwords.
 */
export function normalizeText(text: string, removeStopwords = true): string {
  if (!text) return '';
  
  // 1. Lowercase and remove accents
  let normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // 2. Replace hyphens/slashes with spaces, strip other non-alphanumeric chars
  normalized = normalized.replace(/[-_/\\]/g, ' ');
  normalized = normalized.replace(/[^a-z0-9\s]/g, '');
  
  // 3. Remove extra spacing
  const words = normalized.trim().split(/\s+/);
  
  if (!removeStopwords) {
    return words.join(' ');
  }
  
  // 4. Filter out stopwords
  const filteredWords = words.filter(word => word.length > 0 && !STOP_WORDS.has(word));
  
  return filteredWords.length > 0 ? filteredWords.join(' ') : words.join(' ');
}

/**
 * Calculates similarity between two strings using Dice's Coefficient (0.0 to 1.0)
 */
export function getStringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1, true).replace(/\s+/g, '');
  const s2 = normalizeText(str2, true).replace(/\s+/g, '');
  
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) {
    // If very short, fallback to simple inclusion
    if (s1.includes(s2) || s2.includes(s1)) return 0.5;
    return 0.0;
  }
  
  const bigrams1 = new Map<string, number>();
  for (let i = 0; i < s1.length - 1; i++) {
    const bigram = s1.slice(i, i + 2);
    bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
  }
  
  let intersection = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bigram = s2.slice(i, i + 2);
    const count = bigrams1.get(bigram) || 0;
    if (count > 0) {
      intersection++;
      bigrams1.set(bigram, count - 1);
    }
  }
  
  return (2.0 * intersection) / (s1.length + s2.length - 2);
}

/**
 * Finds the best matching canonical Essence from a search term.
 * Looks for exact synonym match first, then fuzzy similarity match.
 */
export interface MatchResult {
  essence: any; // Essence
  score: number;
  matchedSynonym: string;
}

export function findBestEssenceMatch(
  searchTerm: string,
  essences: any[]
): MatchResult | null {
  if (!searchTerm || searchTerm.trim().length === 0) return null;
  
  const normSearch = normalizeText(searchTerm, true);
  if (!normSearch) return null;
  
  let bestMatch: MatchResult | null = null;
  
  for (const essence of essences) {
    // Check canonical name
    const normCanonical = normalizeText(essence.canonicalName, true);
    if (normCanonical === normSearch) {
      return { essence, score: 1.0, matchedSynonym: essence.canonicalName };
    }
    
    // Check synonyms
    for (const synonym of essence.synonyms) {
      const normSynonym = normalizeText(synonym, true);
      if (normSynonym === normSearch) {
        return { essence, score: 1.0, matchedSynonym: synonym };
      }
    }
  }
  
  // If no exact match, run similarity checks
  for (const essence of essences) {
    // Check canonical similarity
    const scoreCanonical = getStringSimilarity(searchTerm, essence.canonicalName);
    if (scoreCanonical >= 0.65 && (!bestMatch || scoreCanonical > bestMatch.score)) {
      bestMatch = { essence, score: scoreCanonical, matchedSynonym: essence.canonicalName };
    }
    
    // Check synonym similarities
    for (const synonym of essence.synonyms) {
      const scoreSynonym = getStringSimilarity(searchTerm, synonym);
      if (scoreSynonym >= 0.65 && (!bestMatch || scoreSynonym > bestMatch.score)) {
        bestMatch = { essence, score: scoreSynonym, matchedSynonym: synonym };
      }
    }
  }
  
  return bestMatch;
}
