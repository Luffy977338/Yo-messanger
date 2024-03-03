import st from "./post.module.scss";
import { IPost } from "../../interfaces/post.interface";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { checkLetterCount } from "../../utils/fontSizeChecker";
import LikeButton from "../LikeButton/LikeButton";
import PostOptions from "../PostOptions/PostOptions";
import { usePostDate } from "../../hooks/PostHooks";
import PostSlider from "../UI/PostSlider/PostSlider";
import PostComments from "../PostComments/PostComments";
import PostCommentButton from "../PostCommentButton/PostCommentButton";
import { useState } from "react";
import { IUser } from "../../interfaces/user.interface";
import { useTreeLength } from "../../hooks/useTreeLength";

export interface PostProps {
  post: IPost;
  userCreator: IUser;
  canDelete?: boolean;
  beforeDelete?: Function;
}

const Post = ({
  post,
  userCreator,
  canDelete = false,
  beforeDelete,
}: PostProps) => {
  const path = useNavigate();
  const date = usePostDate(post.createdAt);
  const commentsLength = useTreeLength(post.comments, "replies");
  const [commentsCount, setCommentsCount] = useState<number>(commentsLength);

  return (
    <div
      className={[st.post, checkLetterCount(post.content.length)].join(" ")}
      key={post._id}
    >
      <div className={st.postWithoutComments}>
        <div className={st.info__block}>
          <div className={st.post__info}>
            <img
              onClick={() => path(`/${userCreator._id}`)}
              draggable={false}
              className={st.post__info_avatar}
              src={
                userCreator.avatar ||
                `../../../public/assets/images/default-user-avatar.jpg`
              }
              alt=''
            />
            <div>
              <div
                className={st.post__info_username}
                onClick={() => {
                  path(`/${userCreator._id}`);
                }}
              >
                {userCreator.username}
              </div>
              <div className={st.post__info_date}>{date}</div>
            </div>
          </div>
          <PostOptions
            canDelete={canDelete}
            id={post._id}
            beforeDelete={beforeDelete}
          />
        </div>
        <div className={st.allPostContent}>
          <div className={st.post__content}>{post.content}</div>
          <PostSlider pictures={post.pictures} />
        </div>
        <div className={st.post__buttons}>
          <LikeButton post={post} />
          <PostCommentButton commentsLength={commentsCount} />
        </div>
      </div>
      <hr
        style={{
          border: "1px solid var(--primary-color)",
          margin: "30px 0 20px 0",
          display: "inline-flex",
          width: "100%",
        }}
      />
      <PostComments setCommentsCount={setCommentsCount} postId={post._id} />
    </div>
  );
};

export default observer(Post);
