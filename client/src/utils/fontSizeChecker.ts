import st from "./fontSizeChecker.module.scss";

export const checkLetterCount = (letterCount: number) => {
  if (letterCount > 300 && letterCount <= 700) {
    return st.font_big;
  } else if (letterCount > 700 && letterCount <= 1200) {
    return st.font_average;
  } else if (letterCount > 1200 && letterCount <= 2000) {
    return st.font_small;
  } else if (letterCount > 2000) {
    return st.font_tiny;
  } else {
    return st.font_biggest;
  }
};
