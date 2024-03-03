import { useMemo } from "react";

export const useTreeLength = (treeData: any[], nodeChildren: string) => {
  const calculateTreeLength = (node: any) => {
    let length = 1;

    if (node[nodeChildren] && node[nodeChildren].length > 0) {
      node[nodeChildren].forEach((child: any) => {
        length += calculateTreeLength(child);
      });
    }

    return length;
  };

  const getTreeLength = useMemo(() => {
    if (treeData && treeData.length > 0) {
      let totalLength = 0;
      treeData.forEach((node) => {
        totalLength += calculateTreeLength(node);
      });
      return totalLength;
    }
    return 0;
  }, [treeData, nodeChildren]);

  return getTreeLength;
};
