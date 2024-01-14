import React from "react";
import debounce from "../utils/debouce";

export const useInfiniteQueryScrolling = (
  refOrWindow: any,
  callback: any,
  offset: number = 1000,
  type: "default" | "reverse" = "default",
) => {
  const callbackHandler = React.useCallback(
    debounce(() => {
      callback();
    }, 200),
    [callback],
  );

  React.useEffect(() => {
    const target = refOrWindow.current || window;

    const handleScroll = () => {
      let isScrolledPastOffset;

      if (target === window) {
        isScrolledPastOffset =
          document.documentElement.scrollHeight -
            window.innerHeight -
            window.scrollY <
          offset;
      } else {
        if (type === "default") {
          isScrolledPastOffset =
            target.scrollHeight - target.scrollTop - target.clientHeight <
            offset;
        } else if (type === "reverse") {
          isScrolledPastOffset = target.scrollTop < offset;
        }
      }

      if (isScrolledPastOffset) {
        callbackHandler();
      }
    };

    target.addEventListener("scroll", handleScroll);

    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [refOrWindow, callbackHandler, offset, type]);
};
