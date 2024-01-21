import st from "./load-post.module.scss";
import { FiMoreHorizontal } from "react-icons/fi";

const LoadPost = () => {
  return (
    <div className={st.post}>
      <div className={st.info__block}>
        <div className={st.post__info}>
          <img
            className={st.post__info_avatar}
            src={`../../../public/assets/images/default-user-avatar.jpg`}
          />
          <div className={st.post__info_username}></div>
        </div>
        <div
          style={{
            cursor: "pointer",
            fontSize: 28,
            color: "var(--second-dark)",
          }}
        >
          <FiMoreHorizontal />
        </div>
      </div>
      <div>
        <div className={st.post__content}></div>
        <div className={st.img}></div>
      </div>
    </div>
  );
};

export default LoadPost;
