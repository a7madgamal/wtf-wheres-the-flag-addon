
export function debounce<F extends (...args: Array<unknown>) => unknown>(
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