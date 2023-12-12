import { IMessage } from "../../../interfaces/message.interface";
import { API_URL } from "../../../http";
import st from "./message.module.scss";
import user from "../../../store/user";

const Message = ({ message }: { message: IMessage }) => {
   const createdAt = new Date(message.createdAt);
   const hours = createdAt.getHours();
   const minutes = createdAt.getMinutes().toString().padStart(2, "0");

   const isOurMessage = message.messageCreator._id === user.user._id;

   return (
      <div className={[st.message, st.message__we].join(" ")}>
         <div
            className={[
               isOurMessage ? st.message__creator_we : "",
               st.message__creator,
            ].join(" ")}
         >
            <img
               className={st.message__creator_avatar}
               src={`${API_URL}/${message.messageCreator.avatar}`}
               alt=''
            />
            <p className={st.message__creator_username}>
               {message.messageCreator.username}
            </p>
         </div>
         <div
            className={
               isOurMessage
                  ? st.message__content_wrapWe
                  : st.message__content_wrap
            }
         >
            <div
               className={[
                  isOurMessage ? st.message__content_we : st.message__content,
               ].join(" ")}
            >
               <div>
                  <p
                     className={
                        isOurMessage
                           ? st.message__content_textWe
                           : st.message__content_text
                     }
                  >
                     {message.content}
                  </p>
               </div>
               {/* Отображение файла, на бэеке сделать его сохранение */}
               <div
                  className={[
                     isOurMessage ? st.message__date_we : st.message__date,
                  ].join(" ")}
               >{`${hours}:${minutes}`}</div>
            </div>
         </div>
      </div>
   );
};

export default Message;
