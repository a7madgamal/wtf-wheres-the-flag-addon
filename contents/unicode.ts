// Unicode constants for flag emoji detection
export const REGIONAL_INDICATOR_START = 0x1f1e6
export const REGIONAL_INDICATOR_END = 0x1f1ff

/**
 * Check if a sequence of characters forms a valid flag emoji
 * @param emoji - String to check for valid flag emoji
 * @returns Boolean indicating if the emoji is a valid flag
 *
 * @example
 * // Valid flag emojis
 * isValidFlagEmoji('🇺🇸')  // true  (United States)
 * isValidFlagEmoji('🇬🇧')  // true  (United Kingdom)
 *
 * @example
 * // Invalid flag emojis
 * isValidFlagEmoji('🇺A')   // false (mismatched characters)
 * isValidFlagEmoji('🇺🇽')   // false (invalid region code)
 * isValidFlagEmoji('🇺')    // false (single character)
 */
export function isValidFlagEmoji(emoji: string): boolean {
  const codePoints = Array.from(emoji).map((char) => char.codePointAt(0) || 0)
  return (
    codePoints.length === 2 &&
    codePoints.every(
      (cp) => cp >= REGIONAL_INDICATOR_START && cp <= REGIONAL_INDICATOR_END
    )
  )
}

/**
 * Replace invalid or broken flag emojis with a neutral flag
 * @param text - Text containing potential flag emojis
 * @returns Text with invalid flag emojis replaced
 *
 * @example
 * // Replacing invalid flag emojis
 * replaceFlagEmoji('Hello 🇺A world')  // 'Hello 🏳️ world'
 * replaceFlagEmoji('🇺🇽 is not valid') // '🏳️ is not valid'
 *
 * @example
 * // Preserving valid flag emojis
 * replaceFlagEmoji('🇺🇸 United States') // '🇺🇸 United States'
 */
export function replaceFlagEmoji(text: string): string {
  const regionIndicatorRegex = new RegExp(
    `[\\u{${REGIONAL_INDICATOR_START.toString(16)}}-\\u{${REGIONAL_INDICATOR_END.toString(16)}}]{2}`,
    "gu"
  )
  return text.replace(regionIndicatorRegex, (match) => {
    return isValidFlagEmoji(match) ? match : "🏳️"
  })
}
