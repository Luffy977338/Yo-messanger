import { useQuery, useQueryClient } from "@tanstack/react-query";
import $api from "../../http";
import { IUser } from "../../interfaces/user.interface";
import user from "../../store/user";
import ChatUser from "../UI/ChatUser/ChatUser";
import Loader from "../UI/Loader/Loader";
import { useNavigate } from "react-router-dom";
import React from "react";
import st from "./chat-users-list.module.scss";
import { IMessage } from "../../interfaces/message.interface";

const ChatUsersList = ({
   messages,
   username,
}: {
   messages: IMessage[];
   username: string | null;
}) => {
   const path = useNavigate();
   const queryClient = useQueryClient();

   const { isLoading, data } = useQuery(
      ["recentUsers", user.user._id],
      () => {
         return $api.get(`/${user.user._id}`);
      },
      { select: (data) => data.data },
   );

   React.useEffect(() => {
      for (let i = 0; i < 7; i++) {
         setTimeout(() => {
            queryClient.invalidateQueries(["recentUsers"]);
         }, 250);
      }
   }, [data, messages]);

   return (
      <div className={st.chat__users}>
         <ul>
            {isLoading ? (
               <Loader />
            ) : data ? (
               <>
                  {data?.recentChatUsers?.map(
                     (
                        u: { user: IUser; lastMessage: IMessage },
                        index: number,
                     ) => (
                        <li
                           onClick={() => {
                              path(
                                 `/messages?user=${
                                    u.user._id
                                 }&name=${u.user.username.toLocaleLowerCase()}`,
                              );
                           }}
                           key={index}
                           className={st.chatUser}
                           style={
                              u.user.username === username
                                 ? { background: "var(--primary-color)" }
                                 : {}
                           }
                        >
                           <ChatUser
                              chatUser={u.user}
                              lastMessage={u.lastMessage}
                           />
                        </li>
                     ),
                  )}
               </>
            ) : (
               ""
            )}
         </ul>
      </div>
   );
};

export default ChatUsersList;
