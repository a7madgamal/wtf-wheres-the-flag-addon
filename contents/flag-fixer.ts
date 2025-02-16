import { replaceFlagEmoji } from "~/src/utils/unicode"

// Mutation observer configuration for efficient DOM scanning
const observerConfig: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true
}

// Debounce utility to limit processing frequency with improved type safety
function debounce<F extends (...args: Array<unknown>) => unknown>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      console.log("🕰️ Debounce: Previous timeout cleared")
    }

    timeoutId = setTimeout(() => {
      console.log("🚀 Debounce: Processing mutations")
      func(...args)
      timeoutId = null
    }, delay)
  }
}

// Process mutations and replace flag emojis in text nodes
function processMutations(mutations: MutationRecord[]): void {
  console.log(`🔍 Processing ${mutations.length} mutations`)

  mutations.forEach((mutation, index) => {
    console.log(`Mutation ${index + 1} type: ${mutation.type}`)

    if (mutation.type === "characterData") {
      const target = mutation.target
      if (target.nodeType === Node.TEXT_NODE) {
        const text = target.textContent || ""
        const fixedText = replaceFlagEmoji(text)

        console.log(`Original text: "${text}"`)
        console.log(`Fixed text:    "${fixedText}"`)

        if (text !== fixedText) {
          console.log("🚩 Fixing flag emoji")
          target.textContent = fixedText
        }
      }
    }
  })
}

// Initialize the mutation observer
function initFlagFixer(): void {
  console.log("🌟 Initializing Flag Fixer")

  const debouncedHandler = debounce(processMutations, 2000)
  const observer = new MutationObserver(debouncedHandler)

  // Only start observing after a short delay to prevent initial page load overhead
  setTimeout(() => {
    console.log("🕵️ Starting DOM observation")
    observer.observe(document.body, observerConfig)
  }, 500)
}

// Run the flag fixer when the script loads
console.log("🚦 Flag Fixer script loaded")
initFlagFixer()
