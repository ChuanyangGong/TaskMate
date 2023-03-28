export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: NodeJS.Timeout | undefined;
  let result: ReturnType<T> | undefined;

  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const context = this;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = undefined;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
    return result;
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): T & { cancel(): void } {
  let timeout: ReturnType<typeof setTimeout> | null,
    context: any,
    args: unknown[] | null,
    result: unknown;
  let previous = 0;
  if (!options) options = {};

  const later = function () {
    previous = options?.leading === false ? 0 : Date.now();
    timeout = null;
    if (args) {
      func.apply(context, args);
      if (!timeout) context = args = null;
    }
  };

  const throttled = function (...throttledArgs: unknown[]) {
    const now = Date.now();
    if (!previous && options?.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = throttledArgs;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options?.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  } as T & { cancel(): void };

  throttled.cancel = function () {
    clearTimeout(timeout!);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}
