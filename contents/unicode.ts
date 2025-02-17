import { FLAGS } from "./flags"

// Unicode constants for flag emoji detection
export const REGIONAL_INDICATOR_START = 0x1f1e6
export const REGIONAL_INDICATOR_END = 0x1f1ff

/**
 * Check if a sequence of characters forms a valid flag emoji
 * @param emoji - String to check for valid flag emoji
 * @returns Boolean indicating if the emoji is a valid flag
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

function getFlagCountryCode(emoji: string): string | null {
  if (!isValidFlagEmoji(emoji)) return null

  const regionIndicators = Array.from(emoji)
  const countryCode = regionIndicators
    .map((char) => String.fromCodePoint(char.codePointAt(0)!).toUpperCase())
    .join("")

  return countryCode
}

/**
 * Create an SVG flag element for a given flag emoji
 * @param emoji - Flag emoji to replace
 * @returns HTML element with flag icon or neutral flag
 */
export function createFlagElement(emoji: string): HTMLElement {
  const countryCode = getFlagCountryCode(emoji)
  const flagInfo = FLAGS[emoji] as unknown as (typeof FLAGS)[keyof typeof FLAGS]
  const flagIcon = document.createElement("span")

  // Set default inline styles to make image relative to font size
  flagIcon.style.display = "inline-block"
  // flagIcon.style.verticalAlign = "middle"
  flagIcon.style.width = "0.98em" // Width relative to font size
  flagIcon.style.height = "0.75em" // Height relative to font size
  // flagIcon.style.marginLeft = "0.2em"
  // flagIcon.style.marginRight = "0.2em"
  flagIcon.style.backgroundSize = "cover"
  flagIcon.style.backgroundPosition = "center"

  if (!countryCode || !flagInfo) {
    console.error("Invalid flag emoji: " + emoji)
    flagIcon.textContent = "Unknown flag 🐞"
    return flagIcon
  }

  // Use chrome-extension:// URL for assets, using 4x3 subdirectory
  const flagImageUrl = chrome.runtime.getURL(
    `assets/flags/4x3/${flagInfo.image}`
  )

  // Set background image instead of img tag for better sizing control
  flagIcon.style.backgroundImage = `url('${flagImageUrl}')`
  flagIcon.setAttribute("aria-label", `Flag of ${countryCode}`)

  return flagIcon
}

/**
 * Replace flag emojis with flag icons
 * @param text - Text containing potential flag emojis
 * @returns Text with flag emojis replaced by flag icons
 */
export function replaceFlagEmoji(text: string): string {
  const regionIndicatorRegex = new RegExp(
    `[\\u{${REGIONAL_INDICATOR_START.toString(16)}}-\\u{${REGIONAL_INDICATOR_END.toString(16)}}]{2}`,
    "gu"
  )

  return text.replace(regionIndicatorRegex, (match) => {
    const flagElement = createFlagElement(match)
    const wrapper = document.createElement("div")
    wrapper.appendChild(flagElement)
    return wrapper.innerHTML
  })
}
