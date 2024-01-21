import { FaHeart } from "react-icons/fa";
import st from "./like-user.module.scss";
import { useNavigate } from "react-router-dom";

const LikeUser = ({
  avatar,
  username,
  id,
}: {
  avatar: string;
  username: string;
  id: string;
}) => {
  const path = useNavigate();
  return (
    <div onClick={() => path(`/${id}`)} className={st.likeUser}>
      <img
        src={avatar || `../../../public/assets/images/default-user-avatar.jpg`}
        alt=''
      />
      <p>{username}</p>
      <div className={st.heart}>
        <FaHeart />
      </div>
    </div>
  );
};

export default LikeUser;
