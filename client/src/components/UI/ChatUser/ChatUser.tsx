import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../http";
import { IUser } from "../../../interfaces/user.interface";
import st from "./chat-user.module.scss";

const ChatUser = ({ user }: { user: IUser }) => {
   const path = useNavigate();

   return (
      <div
         onClick={() => {
            path(`/messages?user=${user._id}`);
         }}
         className={st.chatUser}
      >
         <div>
            <img
               className={st.chatUser__img}
               src={`${API_URL}/${user.avatar}`}
               alt=''
            />
         </div>
         <div className={st.chatUser__prevInfo}>
            <div className={st.chatUser__username}>{user.username}</div>

            <div className={st.chatUser__prevMessage}>
               message
               {/* Сделать здесь отображение последнего сообщения */}
            </div>
         </div>
      </div>
   );
};

export default ChatUser;
