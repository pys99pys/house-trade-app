export const debounce = (fn: (...args: any) => void, duration = 300) => {
  let timer: number = 0;

  return (...args: any) => {
    clearTimeout(timer);

    timer = window.setTimeout(() => {
      fn(...args);
      clearTimeout(timer);
    }, duration);
  };
};
