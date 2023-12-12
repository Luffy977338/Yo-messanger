import React from "react";

export const useIsScrolling = (
   setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>,
   ref: React.MutableRefObject<null | HTMLDivElement>,
) => {
   React.useEffect(() => {
      let scrollTimeout: any;

      const handleScroll = () => {
         setIsScrolling(true);
         clearTimeout(scrollTimeout);
         scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
         }, 200);
      };

      ref.current?.addEventListener("scroll", handleScroll);

      return () => {
         ref.current?.removeEventListener("scroll", handleScroll);
      };
   }, []);
};
