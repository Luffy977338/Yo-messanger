import React from "react";
import user from "../../../store/user";
import st from "./chat-input.module.scss";
import socket from "../../../store/socket";
import { observer } from "mobx-react-lite";

const ChatInput = ({ userSearch }: { userSearch: string }) => {
  const [messageInput, setMessageInput] = React.useState<string>("");
  const divInputRef = React.useRef<null | HTMLDivElement>(null);
  const sendMessage = (message: {
    creatorId: string;
    createdAt: Date;
    content: string;
    picture: null | File;
  }) => {
    if (socket.socket) {
      const roomId = [`${user.user._id}`, userSearch].sort().join("_");
      socket.socket.emit("message", {
        roomId,
        message,
        messageToId: userSearch,
      });
      setMessageInput("");
      if (divInputRef.current) {
        divInputRef.current.innerText = "";
      }
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
    }
    setMessageInput("");
    if (divInputRef.current) {
      divInputRef.current.innerText = "";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleContentChange = () => {
    if (divInputRef.current) {
      setMessageInput(divInputRef.current.innerText);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={st.messages__send}>
        <div className={st.messages__send_inputWrap}>
          <div
            ref={divInputRef}
            className={st.messages__send_input}
            onKeyDown={handleKeyDown}
            contentEditable={true}
            role='textbox'
            onInput={handleContentChange}
            aria-multiline='true'
          ></div>
          {!messageInput && (
            <span className={st.messages__send_placeholder}>
              Введите сообщение
            </span>
          )}
        </div>
        <button className={st.messages__send_button} type='submit'>
          {">"}
        </button>
      </div>
    </form>
  );
};

export default observer(ChatInput);
