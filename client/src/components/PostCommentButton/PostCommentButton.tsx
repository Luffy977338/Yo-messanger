import { FaRegComment } from "react-icons/fa";
import st from "./post-comment-button.module.scss";

const PostCommentButton = ({ commentsLength }: { commentsLength: number }) => {
  return (
    <div className={st.commentButton}>
      <FaRegComment />
      <span>{commentsLength}</span>
    </div>
  );
};

export default PostCommentButton;
