import { FaHeart } from "react-icons/fa";
import { API_URL } from "../../../http";
import st from "./like-user.module.scss";
import { useNavigate } from "react-router-dom";

const LikeUser = ({
   avatar,
   username,
   id,
}: {
   avatar: string;
   username: string;
   id: number;
}) => {
   const path = useNavigate();
   return (
      <div onClick={() => path(`/${id}`)} className={st.likeUser}>
         <img src={`${API_URL}/${avatar}`} alt='' />
         <p>{username}</p>
         <div className={st.heart}>
            <FaHeart />
         </div>
      </div>
   );
};

export default LikeUser;
