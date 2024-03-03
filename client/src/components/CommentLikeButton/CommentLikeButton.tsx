import { FaHeart, FaRegHeart } from "react-icons/fa";
import st from "./comment-like-button.module.scss";
import { useState } from "react";
import { IComment } from "../../interfaces/comment.interface";
import user from "../../store/user";
import { useLikeComment, useRemoveLikeComment } from "../../hooks/CommentHooks";

const CommentLikeButton = ({
  comment,
  mainSt,
}: {
  comment: IComment;
  mainSt: CSSModuleClasses;
}) => {
  const [likes, setLikes] = useState<number>(comment.likes.length);
  const [isLiked, setIsLiked] = useState(
    comment.likes.map((obj) => obj._id).includes(user.user._id),
  );
  const like = useLikeComment({
    commentId: comment._id,
    setIsLiked: setIsLiked,
    setLikes: setLikes,
  });

  const removeLike = useRemoveLikeComment({
    commentId: comment._id,
    setIsLiked: setIsLiked,
    setLikes: setLikes,
  });

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    //! notification on comment reply
    // if (comment.user._id !== user.user._id) {
    //   createNotification("like", {
    //     postId: post._id,
    //     toUserId: post.userCreator._id,
    //     userId: user.user._id,
    //   });
    // }
  };

  const handleRemoveLike = () => {
    setLikes(likes - 1);
    setIsLiked(false);
  };

  return (
    <button
      className={st.like}
      onClick={() => {
        isLiked ? handleRemoveLike() : handleLike();
        isLiked ? removeLike.mutateAsync() : like.mutateAsync();
      }}
    >
      <div
        style={likes ? { opacity: "1" } : {}}
        className={[st.wrap, mainSt.like].join(" ")}
      >
        {isLiked ? (
          <div className={st.like__filled}>
            <FaHeart />
          </div>
        ) : (
          <div className={st.like__outlined}>
            <FaRegHeart />
          </div>
        )}
        <p>{likes}</p>
      </div>
    </button>
  );
};

export default CommentLikeButton;
