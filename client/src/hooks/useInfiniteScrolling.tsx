import React from "react";

export const useInfiniteQueryScrolling = async (
   container: any,
   callback: any,
   offset: number = 1000,
) => {
   const callbackRef = React.useRef(() => callback);
   React.useEffect(() => {
      callbackRef.current = callback;
   }, [callback]);
   React.useEffect(() => {
      const onScroll = () => {
         const scrollY = window.scrollY;
         const windowHeight = window.innerHeight;
         const documentHeight = document.documentElement.scrollHeight;
         if (scrollY + windowHeight >= documentHeight - offset) {
            callbackRef.current();
         }
      };

      container.addEventListener("scroll", onScroll);
      return () => container.removeEventListener("scroll", onScroll);
   }, [container, offset]);
};
