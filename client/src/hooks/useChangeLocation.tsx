import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useChangeLocation(func: Function) {
  const location = useLocation();

  useEffect(() => {
    func();
  }, [location]);
}
