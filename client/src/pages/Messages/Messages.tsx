import React from "react";
import io from "socket.io-client";
import user from "../../store/user";
import st from "./messages.module.scss";
import { useLocation } from "react-router-dom";
import { IMessage } from "../../interfaces/message.interface";
import ChatInput from "../../components/UI/ChatInput/ChatInput";
import MessagesList from "../../components/MessagesList/MessagesList";
import ChatTop from "../../components/ChatTop/ChatTop";
import ChatUsersList from "../../components/ChatUsersList/ChatUsersList";

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
   const [socket, setSocket] = React.useState<any>(null);

   React.useEffect(() => {
      const newSocket = io("http://localhost:80");
      setSocket(newSocket);

      return () => {
         newSocket.disconnect();
      };
   }, []);

   React.useEffect(() => {
      if (socket) {
         socket.on("newMessage", (message: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
         });
      }
   }, [socket]);

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
      if (socket) {
         if (socket.room) {
            socket.emit("leave", socket.room);
            socket.room = null;
         }

         const roomId = [`${user.user._id}`, userIdSearch].sort().join("_");
         setRoomId(roomId);
         socket.room = roomId;
         socket.emit("join", roomId);
      }
   };

   return (
      <div className={st.chat}>
         <ChatUsersList username={usernameSearch} messages={messages} />
         {userIdSearch ? (
            <div className={st.chat__messages}>
               <ChatTop username={usernameSearch} />
               <MessagesList socketMessages={messages} roomId={roomId} />
               <ChatInput socket={socket} userSearch={userIdSearch} />
            </div>
         ) : (
            <div>Выберите беседу</div>
         )}
      </div>
   );
};

export default Messages;
