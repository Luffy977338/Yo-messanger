import st from "../components/UI/Post/post.module.scss";

export const checkLetterCount = (letterCount: number) => {
   if (letterCount > 300 && letterCount <= 700) {
      return st.post__content_big;
   } else if (letterCount > 700 && letterCount <= 1200) {
      return st.post__content_average;
   } else if (letterCount > 1200 && letterCount <= 2000) {
      return st.post__content_small;
   } else if (letterCount > 2000) {
      return st.post__content_tiny;
   } else {
      return st.post__content_biggest;
   }
};
