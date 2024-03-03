import { useState } from "react";
import user from "../../store/user";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import st from "./like-button.module.scss";
import { observer } from "mobx-react-lite";
import { useLike, useRemoveLike } from "../../hooks/PostHooks";
import { useCreateNewNotification } from "../../hooks/NotificationsHooks";
import { IPost } from "../../interfaces/post.interface";

const LikeButton = ({ post }: { post: IPost }) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likes.includes(user.user._id),
  );
  const [likes, setLikes] = useState<number>(post.likes.length);
  const like = useLike(post._id, setLikes, setIsLiked);
  const removeLike = useRemoveLike(post._id, setLikes, setIsLiked);
  const createNotification = useCreateNewNotification();

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    if (post.userCreator._id !== user.user._id) {
      createNotification("like", {
        postId: post._id,
        toUserId: post.userCreator._id,
        userId: user.user._id,
      });
    }
  };

  const handleRemoveLike = () => {
    setLikes(likes - 1);
    setIsLiked(false);
  };

  return (
    <button
      className={[st.like, isLiked ? st.like__active : ""].join(" ")}
      onClick={() => {
        isLiked ? handleRemoveLike() : handleLike();
        isLiked ? removeLike.mutateAsync() : like.mutateAsync();
      }}
    >
      <div className={st.wrap}>
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

export default observer(LikeButton);
