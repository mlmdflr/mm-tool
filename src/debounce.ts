export function debounce<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  waitMilliseconds = 50,
  options: {
    isImmediate?: boolean;
    maxWait?: number;
    callback?: (data: ReturnType<F>) => void;
  } = {},
): {
  (
    this: ThisParameterType<F>,
    ...args: Args & Parameters<F>
  ): Promise<ReturnType<F>>;
  cancel: (reason?: any) => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options.isImmediate ?? false;
  const callback = options.callback ?? false;
  const maxWait = options.maxWait;
  let lastInvokeTime = Date.now();
  let promises: {
    resolve: (result: ReturnType<F>) => void;
    reject: (reason?: any) => void;
  }[] = [];
  function nextInvokeTimeout() {
    if (maxWait !== undefined) {
      const timeSinceLastInvocation = Date.now() - lastInvokeTime;
      if (timeSinceLastInvocation + waitMilliseconds >= maxWait)
        return maxWait - timeSinceLastInvocation;
    }
    return waitMilliseconds;
  }
  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ) {
    const context = this;
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = function () {
        timeoutId = undefined;
        lastInvokeTime = Date.now();
        if (!isImmediate) {
          const result = func.apply(context, args);
          callback && callback(result);
          promises.forEach(({ resolve }) => resolve(result));
          promises = [];
        }
      };
      const shouldCallNow = isImmediate && timeoutId === undefined;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = setTimeout(invokeFunction, nextInvokeTimeout());
      if (shouldCallNow) {
        const result = func.apply(context, args);
        callback && callback(result);
        return resolve(result);
      }
      promises.push({ resolve, reject });
    });
  };
  debouncedFunction.cancel = function (reason?: any) {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    promises.forEach(({ reject }) => reject(reason));
    promises = [];
  };
  return debouncedFunction;
}
