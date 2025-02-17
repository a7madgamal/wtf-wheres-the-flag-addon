import React, {useState, useEffect} from "react";
import {replaceFlagEmoji} from "~/contents/unicode";

const observerConfig: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true,
};

function debounce<F extends (...args: Array<unknown>) => unknown>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      console.log("🕰️ Debounce: Previous timeout cleared");
    }

    timeoutId = setTimeout(() => {
      console.log("🚀 Debounce: Processing mutations");
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

function processMutations(mutations: MutationRecord[]): void {
  console.log(`🔍 Processing ${mutations.length} mutations`);

  mutations.forEach((mutation, index) => {
    console.log(`Mutation ${index + 1} type: ${mutation.type}`);

    if (mutation.type === "characterData") {
      const target = mutation.target;
      if (target.nodeType === Node.TEXT_NODE) {
        const text = target.textContent || "";
        const fixedText = replaceFlagEmoji(text);

        console.log(`Original text: "${text}"`);
        console.log(`Fixed text:    "${fixedText}"`);

        if (text !== fixedText) {
          console.log("🚩 Fixing flag emoji");
          target.textContent = fixedText;
        }
      }
    }
  });
}

const FlagFixerButton: React.FC = () => {
  const [observer, setObserver] = useState<MutationObserver | null>(null);

  useEffect(() => {
    console.log("🌟 Initializing Flag Fixer");
    const debouncedHandler = debounce(processMutations, 2000);
    const mutationObserver = new MutationObserver(debouncedHandler);

    // Start observing after a short delay to prevent initial page load overhead
    setTimeout(() => {
      console.log("🕵️ Starting DOM observation");
      mutationObserver.observe(document.body, observerConfig);
    }, 500);

    setObserver(mutationObserver);

    // Cleanup function
    return () => {
      // Use the observer from state to disconnect
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Removed toggle functionality, always enabled
  return null; // No UI needed
};

export default FlagFixerButton;
