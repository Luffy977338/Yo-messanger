import { useState } from "react";
import user from "../../../store/user";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import st from "./like-button.module.scss";
import { IUser } from "../../../interfaces/user.interface";
import { observer } from "mobx-react-lite";
import { useLike, useRemoveLike } from "../../../hooks/PostHooks";
import { useCreateNewNotification } from "../../../hooks/NotificationsHooks";

const LikeButton = ({
  postId,
  postLikes,
  userCreator,
}: {
  postId: string;
  postLikes: string[];
  userCreator: IUser;
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    postLikes.includes(user.user._id),
  );
  const [likes, setLikes] = useState<number>(postLikes.length);
  const like = useLike(postId, likes, setLikes, setIsLiked);
  const removeLike = useRemoveLike(postId, likes, setLikes, setIsLiked);
  const createNotification = useCreateNewNotification();

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    if (userCreator._id !== user.user._id) {
      createNotification("like", {
        likedPostId: postId,
        likedUserId: userCreator._id,
        userId: user.user._id,
      });
    }
  };

  const handleRemoveLike = () => {
    setLikes(likes - 1);
    setIsLiked(false);
  };

  return (
    <div
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
    </div>
  );
};

export default observer(LikeButton);
