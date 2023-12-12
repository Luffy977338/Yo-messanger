import st from "./chat-top.module.scss";

const ChatTop = ({ username }: { username: string | null }) => {
   return <div className={st.messages__top}>{username}</div>;
};

export default ChatTop;
