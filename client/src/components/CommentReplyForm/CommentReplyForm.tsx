import { IoSend } from "react-icons/io5";
import { useReplyComment } from "../../hooks/CommentHooks";
import { IComment } from "../../interfaces/comment.interface";
import user from "../../store/user";
import Input from "../UI/Input/Input";
import st from "./comment-reply-form.module.scss";
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import Loader from "../UI/Loader/Loader";

interface CommentReplyFormProps {
  comment: IComment;
  isReply: boolean;
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

const CommentReplyForm = ({
  comment,
  isReply,
  formRef,
  inputRef,
  message,
  setMessage,
}: CommentReplyFormProps) => {
  const [pictures, setPictures] = useState<File[]>([]);
  const replyComment = useReplyComment(comment._id);

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (replyComment.isLoading) return;
    if (!message && !pictures.length) return;

    await replyComment.mutateAsync({ message: message, pictures });

    setMessage("");
    setPictures([]);
  };

  return (
    <div style={{ position: "relative", display: "flex" }}>
      <div
        style={{
          position: isReply ? "relative" : "absolute",
          bottom: 0,
          zIndex: isReply ? 0 : -1,
        }}
        className={st.input}
      >
        <img src={user.user.avatar} alt='' />
        <form ref={formRef} className={st.form} onSubmit={handleForm}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Ответьте...'
            ref={inputRef}
          />
          <button
            className={st.form__sendButton}
            disabled={replyComment.isLoading}
            type='submit'
            style={
              !message && !pictures.length
                ? { color: "#474747", cursor: "default" }
                : {}
            }
          >
            {replyComment.isLoading ? (
              <div className={st.loader}>
                <Loader />
              </div>
            ) : (
              <IoSend />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentReplyForm;
