import ChatUser from "../../components/UI/ChatUser/ChatUser";
import user from "../../store/user";
import st from "./messages.module.scss";

const Messages = () => {
   return (
      <div className={st.messages}>
         <div className={st.messages__users}>
            <ChatUser user={user.user} />
         </div>
         <div className={st.messages__chat}>
            <div></div>
         </div>
      </div>
   );
};

export default Messages;
