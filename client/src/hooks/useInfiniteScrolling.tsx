import React from "react";

//! Previos version of this hook
// export const useInfiniteQueryScrolling = async (
//    container: any,
//    callback: any,
//    offset: number = 1000,
// ) => {
//    const callbackRef = React.useRef(() => callback);
//    React.useEffect(() => {
//       callbackRef.current = callback;
//    }, [callback]);
//    React.useEffect(() => {
//       const onScroll = () => {
//          const scrollY = window.scrollY;
//          const windowHeight = window.innerHeight;
//          const documentHeight = document.documentElement.scrollHeight;
//          if (scrollY + windowHeight >= documentHeight - offset) {
//             callbackRef.current();
//          }
//       };

//       container.addEventListener("scroll", onScroll);
//       return () => container.removeEventListener("scroll", onScroll);
//    }, [container, offset]);
// };

export const useInfiniteQueryScrolling = (
   refOrWindow: any,
   callback: any,
   offset: number = 1000,
   type: "default" | "reverse" = "default",
) => {
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
            callback();
         }
      };

      target.addEventListener("scroll", handleScroll);

      return () => {
         target.removeEventListener("scroll", handleScroll);
      };
   }, [refOrWindow, callback, offset]);
};
