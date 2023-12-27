import { useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces/user.interface";
import { API_URL } from "../../http";
import React from "react";
import user from "../../store/user";
import st from "./send-message-by-banner.module.scss";
import socket from "../../store/socket";
import { observer } from "mobx-react-lite";

const SendMessageByBanner = ({
  userCreator,
  setIsClicked,
}: {
  userCreator: IUser;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const path = useNavigate();

  React.useEffect(() => {
    if (userCreator) {
      joinChatRoom();
    }
  }, [userCreator]);

  const joinChatRoom = () => {
    if (socket.socket) {
      if (socket.socket.room) {
        socket.socket.emit("leave", socket.socket.room);
        socket.socket.room = null;
      }

      const roomId = [`${user.user._id}`, userCreator].sort().join("_");
      socket.socket.room = roomId;
      socket.socket.emit("join", roomId);
    }
  };

  const [messageInput, setMessageInput] = React.useState<string>("");
  const sendMessage = (message: {
    creatorId: string;
    createdAt: Date;
    content: string;
    picture: null | File;
  }) => {
    if (socket.socket) {
      const roomId = [`${user.user._id}`, userCreator._id].sort().join("_");
      const userCreatorId = userCreator._id.toString();
      socket.socket.emit("message", {
        roomId,
        message,
        messageToId: userCreatorId,
      });
      setMessageInput("");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (messageInput && messageInput.length <= 2000) {
      sendMessage({
        creatorId: `${user.user._id}`,
        createdAt: new Date(Date.now()),
        content: messageInput,
        picture: null,
      });
      setIsClicked(false);
    }
    setMessageInput("");
  };
  return (
    <div className={st.banner}>
      <div className={st.banner__header}>
        <p className={st.banner__header_newMessage}>Новое сообщение</p>
        <p
          className={st.banner__header_user}
          onClick={() => path(`/messages?user=${userCreator?._id}`)}
        >
          Перейти к диалогу с {userCreator?.username}
        </p>
      </div>
      <hr />
      <div className={st.banner__main}>
        <div className={st.banner__main_user}>
          <img
            src={`${API_URL}/${userCreator?.avatar}`}
            draggable={false}
            alt=''
          />
          <p>{userCreator?.username}</p>
        </div>
        <form className={st.banner__form} onSubmit={handleSubmit}>
          <div>
            <textarea
              placeholder='Введите сообщение...'
              className={st.banner__form_input}
              onChange={(e) => setMessageInput(e.target.value)}
            />
          </div>
          <div>
            <button className={st.banner__form_button} type='submit'>
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(SendMessageByBanner);
