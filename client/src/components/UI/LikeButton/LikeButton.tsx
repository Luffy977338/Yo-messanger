import React from "react";
import { useLike, useRemoveLike } from "../../../hooks/Likes";
import user from "../../../store/user";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import st from "./like-button.module.scss";

const LikeButton = ({
   postId,
   postLikes,
}: {
   postId: number;
   postLikes: number[];
}) => {
   const [isLiked, setIsLiked] = React.useState<boolean>(
      postLikes.includes(user.user._id),
   );
   const [likes, setLikes] = React.useState<number>(postLikes.length);
   const like = useLike(postId, likes, setLikes, setIsLiked);
   const removeLike = useRemoveLike(postId, likes, setLikes, setIsLiked);

   const handleLike = () => {
      setLikes(likes + 1);
      setIsLiked(true);
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

export default LikeButton;
