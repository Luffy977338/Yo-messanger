import st from "./post.module.scss";
import { IPost } from "../../interfaces/post.interface";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { API_URL } from "../../http";
import { checkLetterCount } from "../../utils/fontSizeChecker";
import LikeButton from "../UI/LikeButton/LikeButton";
import PostOptions from "../PostOptions/PostOptions";
import { usePostDate } from "../../hooks/PostHooks";
import { Dispatch, SetStateAction } from "react";
import PostSlider from "../UI/PostSlider/PostSlider";

export interface PostProps {
  post: IPost;
  userCreator: any;
  canDelete?: boolean;
  setQueryKey?: Dispatch<SetStateAction<any>>;
}

const Post = ({
  post,
  userCreator,
  canDelete = false,
  setQueryKey,
}: PostProps) => {
  const path = useNavigate();
  const date = usePostDate(post.createdAt);

  return (
    <div
      className={[st.post, checkLetterCount(post.content.length)].join(" ")}
      key={post._id}
    >
      <div className={st.info__block}>
        <div className={st.post__info}>
          <img
            draggable={false}
            className={st.post__info_avatar}
            src={`${API_URL}/${userCreator.avatar}`}
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
          setQueryKey={setQueryKey}
        />
      </div>
      <div>
        <div className={st.post__content}>{post.content}</div>
        <PostSlider pictures={post.pictures} />
      </div>
      <LikeButton
        postId={post._id}
        postLikes={post.likes}
        userCreator={userCreator}
      />
    </div>
  );
};

export default observer(Post);
