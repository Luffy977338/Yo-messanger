import st from "./post.module.scss";
import { IPost } from "../../../interfaces/post.interface";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { API_URL } from "../../../http";
import { checkLetterCount } from "../../../utils/fontSizeChecker";
import LikeButton from "../LikeButton/LikeButton";
import PostOptions from "../PostOptions/PostOptions";
import { monthNames } from "../../../constants/month";

interface PostProps {
  post: IPost;
  userCreator: any;
  canDelete?: boolean;
}

const Post = ({ post, userCreator, canDelete = false }: PostProps) => {
  const path = useNavigate();

  const date = new Date();
  const createdAt = new Date(post.createdAt);
  const hours = createdAt.getHours();
  const minutes = createdAt.getMinutes().toString().padStart(2, "0");
  const month = createdAt.getMonth();
  const dayOfMonth = createdAt.getDate();
  const year = createdAt.getFullYear();
  const isCreatedInThisYear = createdAt.getFullYear() === date.getFullYear();
  const isCreatedToday = dayOfMonth === date.getDate();
  const isCreatedYesterday = dayOfMonth === date.getDate() - 1;

  function getDate() {
    const date = isCreatedInThisYear
      ? isCreatedToday
        ? `сегодня в ${hours}:${minutes}`
        : isCreatedYesterday
        ? `вчера в ${hours}:${minutes}`
        : `${dayOfMonth} ${monthNames[month]} в ${hours}:${minutes}`
      : `${dayOfMonth} ${monthNames[month]} ${year}`;

    return date;
  }

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
            <div className={st.post__info_date}>{getDate()}</div>
          </div>
        </div>
        <PostOptions
          canDelete={canDelete}
          id={post._id}
          picture={post.picture}
        />
      </div>
      <div>
        <div className={st.post__content}>{post.content}</div>
        {post.picture ? (
          <div>
            <img
              draggable={false}
              className={[st.img, post.content ? st.img__margin : ""].join(" ")}
              src={`${API_URL}/${post.picture}`}
              alt=''
            />
          </div>
        ) : (
          ""
        )}
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
