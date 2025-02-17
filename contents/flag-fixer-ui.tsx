import React, { useEffect } from "react";
import {replaceFlagEmoji} from "~/contents/unicode";
import { debounce } from "~helpers/debounce";

const observerConfig: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true,
};

function replaceTextNodesRecursively(node: Node): boolean {
  let flagFound = false;

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    const fixedText = replaceFlagEmoji(text);
    
    if (text !== fixedText) {
      // Only replace if the flag code actually changed something
      alert(`Replacing text: "${text}" -> "${fixedText}"`);
      node.textContent = fixedText;
      flagFound = true;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Check child nodes and accumulate flag findings
    node.childNodes.forEach(childNode => {
      if (replaceTextNodesRecursively(childNode)) {
        flagFound = true;
      }
    });
  }

  return flagFound;
}

function searchAndReplaceFlags(): boolean {
  alert("🚩 Searching for flags in the entire page");
  
  // Start from the body and recursively replace text nodes
  const flagsFound = replaceTextNodesRecursively(document.body);
  
  return flagsFound;
}

function processMutations(mutations: MutationRecord[]): void {
  alert(`🔍 Processing ${mutations.length} mutations`);

  mutations.forEach((mutation, index) => {
    alert(`Mutation ${index + 1} type: ${mutation.type}`);

    if (mutation.type === "characterData") {
      const target = mutation.target;
      if (target.nodeType === Node.TEXT_NODE) {
        const text = target.textContent || "";
        const fixedText = replaceFlagEmoji(text);

        alert(`Original text: "${text}"`);
        alert(`Fixed text:    "${fixedText}"`);

        if (text !== fixedText) {
          alert("🚩 Fixing flag emoji");
          target.textContent = fixedText;
        }
      }
    }
  });
}

const FlagFixer: React.FC = () => {
  useEffect(() => {
    alert('Initializing Flag Fixer');
    
    // First, do an initial search and replace across the entire page
    const flagsFound = searchAndReplaceFlags();
    
    // Only set up mutation observer if flags were found
    if (flagsFound) {
      const debouncedHandler = debounce(processMutations, 2000);
      const mutationObserver = new MutationObserver(debouncedHandler);

      // Start observing after a short delay to prevent initial page load overhead
      const timeoutId = setTimeout(() => {
        alert("🕵️ Starting DOM observation");
        mutationObserver.observe(document.body, observerConfig);
      }, 500);

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        mutationObserver.disconnect();
      };
    }
  }, []);

  return null;
};

export default FlagFixer;
