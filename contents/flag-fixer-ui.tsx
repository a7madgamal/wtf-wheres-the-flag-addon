import React, { useEffect } from "react"

import { createFlagElement, isValidFlagEmoji } from "~/contents/unicode"
import { debounce } from "~helpers/debounce"

const observerConfig: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true
}

function replaceTextNodesRecursively(node: Node): boolean {
  let flagFound = false

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || ""
    const regionIndicatorRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu
    const matches = text.match(regionIndicatorRegex) || []

    if (matches.length > 0) {
      // Create a fragment to replace the text node
      const fragment = document.createDocumentFragment()

      // Split the text and replace flag emojis
      let lastIndex = 0
      matches.forEach((match) => {
        const matchIndex = text.indexOf(match, lastIndex)

        // Add text before the match
        if (matchIndex > lastIndex) {
          const textBefore = text.slice(lastIndex, matchIndex)
          fragment.appendChild(document.createTextNode(textBefore))
        }

        // Add flag element for the match
        if (isValidFlagEmoji(match)) {
          fragment.appendChild(createFlagElement(match))
        } else {
          fragment.appendChild(document.createTextNode(match))
        }

        lastIndex = matchIndex + match.length
      })

      // Add any remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
      }

      // Replace the original text node with the fragment
      const parentNode = node.parentNode
      if (parentNode) {
        parentNode.replaceChild(fragment, node)
        flagFound = true
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Check child nodes and accumulate flag findings
    node.childNodes.forEach((childNode) => {
      if (replaceTextNodesRecursively(childNode)) {
        flagFound = true
      }
    })
  }

  return flagFound
}

function searchAndReplaceFlags(): boolean {
  // Start from the body and recursively replace text nodes
  const flagsFound = replaceTextNodesRecursively(document.body)

  return flagsFound
}

function processMutations(mutations: MutationRecord[]): void {
  mutations.forEach((mutation) => {
    if (mutation.type === "characterData") {
      const target = mutation.target
      if (target.nodeType === Node.TEXT_NODE) {
        replaceTextNodesRecursively(target)
      }
    }
  })
}

const FlagFixer: React.FC = () => {
  useEffect(() => {
    // First, do an initial search and replace across the entire page
    const flagsFound = searchAndReplaceFlags()

    // Only set up mutation observer if flags were found
    if (flagsFound) {
      const debouncedHandler = debounce(processMutations, 2000)
      const mutationObserver = new MutationObserver(debouncedHandler)

      // Start observing after a short delay to prevent initial page load overhead
      const timeoutId = setTimeout(() => {
        mutationObserver.observe(document.body, observerConfig)
      }, 500)

      // Cleanup function
      return () => {
        clearTimeout(timeoutId)
        mutationObserver.disconnect()
      }
    }
  }, [])

  return null
}

export default FlagFixer
