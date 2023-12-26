import React from "react";
import user from "../../store/user";
import st from "./messages.module.scss";
import { useLocation } from "react-router-dom";
import { IMessage } from "../../interfaces/message.interface";
import ChatInput from "../../components/UI/ChatInput/ChatInput";
import MessagesList from "../../components/MessagesList/MessagesList";
import ChatTop from "../../components/ChatTop/ChatTop";
import ChatUsersList from "../../components/ChatUsersList/ChatUsersList";
import socket from "../../store/socket";

const Messages = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [userIdSearch, setUserIdSearch] = React.useState(
    searchParams.get("user"),
  );
  const [usernameSearch, setUsernameSearch] = React.useState(
    searchParams.get("name"),
  );
  const [roomId, setRoomId] = React.useState<string>(
    [`${user.user._id}`, userIdSearch].sort().join("_"),
  );

  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const handleNewMessage = (message: IMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  React.useEffect(() => {
    if (socket.socket) {
      socket.socket.on("newMessage", handleNewMessage);
    }

    return () => {
      if (socket.socket) {
        socket.socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket.socket]);

  React.useEffect(() => {
    if (!location.search) {
      return setUserIdSearch(null);
    }
    const searchParams = new URLSearchParams(location.search);
    setUserIdSearch(searchParams.get("user"));
    setUsernameSearch(searchParams.get("name"));
    setMessages([]);
  }, [location.search]);

  React.useEffect(() => {
    if (userIdSearch) {
      setRoomId([`${user.user._id}`, userIdSearch].sort().join("_"));
      joinChatRoom();
    }
  }, [userIdSearch]);

  const joinChatRoom = () => {
    if (socket.socket) {
      if (socket.socket.room) {
        socket.socket.emit("leave", socket.socket.room);
        socket.socket.room = null;
      }

      const roomId = [`${user.user._id}`, userIdSearch].sort().join("_");
      setRoomId(roomId);
      socket.socket.room = roomId;
      socket.socket.emit("join", roomId);
    }
  };

  return (
    <div className={st.chat}>
      <ChatUsersList username={usernameSearch} messages={messages} />
      {userIdSearch ? (
        <div className={st.chat__messages}>
          <ChatTop username={usernameSearch} />
          <MessagesList socketMessages={messages} roomId={roomId} />
          <ChatInput userSearch={userIdSearch} />
        </div>
      ) : (
        <div>Выберите беседу</div>
      )}
    </div>
  );
};

export default Messages;
