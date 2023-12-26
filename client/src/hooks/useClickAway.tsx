import { Dispatch, SetStateAction, useEffect } from "react";

export function useClickAway(
  setIsClicked: Dispatch<SetStateAction<boolean>>,
  refs: React.RefObject<HTMLElement>[],
) {
  const handleClickAway = (event: MouseEvent) => {
    const isClickedAway = refs.every(
      (ref) => ref.current && !ref.current.contains(event.target as Node),
    );
    if (isClickedAway) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, [refs, setIsClicked]);
}
