import { API_URL } from "../../../http";
import { IMessage } from "../../../interfaces/message.interface";
import { IUser } from "../../../interfaces/user.interface";
import user from "../../../store/user";
import st from "./chat-user.module.scss";
import { observer } from "mobx-react-lite";

const ChatUser = ({
  chatUser,
  lastMessage,
}: {
  chatUser: IUser;
  lastMessage: IMessage | null;
}) => {
  return (
    <>
      <div>
        <img
          className={st.chatUser__img}
          src={`${API_URL}/${chatUser.avatar}`}
          alt=''
        />
      </div>
      <div className={st.chatUser__prevInfo}>
        <div className={st.chatUser__username}>{chatUser.username}</div>

        <div className={st.chatUser__prevMessage}>
          {`${
            lastMessage?.messageCreator.username === user.user.username
              ? "Вы"
              : lastMessage?.messageCreator.username
              ? lastMessage.messageCreator.username
              : "..."
          }: ${
            lastMessage?.content
              ? lastMessage.content
              : lastMessage?.picture
              ? "Фотография"
              : ""
          }`}
        </div>
      </div>
    </>
  );
};

export default observer(ChatUser);
