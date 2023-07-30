export function throttle<R, A extends any[]>(
  func: (...args: A) => R,
  delay: number,
): [(...args: A) => R | undefined, () => void] {
  let wait = false;
  let timeout: undefined | number;
  let cancelled = false;
  return [
    (...args: A) => {
      if (cancelled) return undefined;
      if (wait) return undefined;
      const val = func(...args);
      wait = true;
      timeout = window.setTimeout(() => {
        wait = false;
      }, delay);
      return val;
    },
    () => {
      cancelled = true;
      clearTimeout(timeout);
    },
  ];
}
