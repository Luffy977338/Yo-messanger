const debounce = <F extends (...args: any[]) => void>(
  func: F,
  delay: number = 300,
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<F>) {
    const context = this;

    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

export default debounce;
