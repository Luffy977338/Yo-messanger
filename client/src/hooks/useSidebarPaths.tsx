import { Dispatch, SetStateAction, useEffect } from "react";
import { IPath } from "../interfaces/SideBarPaths";
import { defaultPaths } from "../constants/sidebarPaths";

// При перезагрузке делает paths какими сделал их пользователь, при добавлении путей в defaultPaths
// автоматически проверяет значения в localStorage и убирает или добавляет туда новый элемент
// с сохраненными настройками
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function useSidebarPaths(
  paths: IPath[],
  setPaths: Dispatch<SetStateAction<IPath[]>>,
) {
  useEffect(() => {
    const storedPaths = localStorage.getItem("sidebarPaths");

    if (storedPaths) {
      const parsedStoredPaths: IPath[] = JSON.parse(storedPaths);
      const updatedPaths = defaultPaths.map((defaultPath) => {
        const matchingStoredPath = parsedStoredPaths.find(
          (storedPath: IPath) => {
            const storedPathToCompare: any = { ...storedPath };
            const defaultPathToCompare: any = { ...defaultPath };
            delete storedPathToCompare.included;
            delete defaultPathToCompare.included;

            return deepEqual(storedPathToCompare, defaultPathToCompare);
          },
        );

        return matchingStoredPath ? matchingStoredPath : defaultPath;
      });

      setPaths(updatedPaths);
    } else {
      setPaths(defaultPaths);
    }
  }, []);

  useEffect(() => {
    if (paths.length) {
      localStorage.setItem("sidebarPaths", JSON.stringify(paths));
    }
  }, [paths]);
}
