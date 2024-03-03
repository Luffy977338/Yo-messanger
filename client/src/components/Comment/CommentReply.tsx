import { Dispatch, FC, HTMLProps, RefObject, SetStateAction } from "react";
import { IComment } from "../../interfaces/comment.interface";
import { useNavigate } from "react-router-dom";
import st from "./comment.module.scss";
import CommentContent from "../CommentContent/CommentContent";

interface CommentReplyProps extends HTMLProps<HTMLDivElement> {
  comment: IComment;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const CommentReply: FC<CommentReplyProps> = ({
  comment,
  setIsReply,
  formRef,
  inputRef,
  setMessage,
  ...options
}) => {
  const path = useNavigate();

  return (
    <div {...options} className={st.comment}>
      <div>
        <img
          className={st.comment__avatar_reply}
          src={comment.user.avatar}
          alt=''
          onClick={() => path(`/${comment.user._id}`)}
        />
      </div>
      <CommentContent
        mainSt={st}
        comment={comment}
        formRef={formRef}
        inputRef={inputRef}
        setIsReply={setIsReply}
        setMessage={setMessage}
      />
    </div>
  );
};

export default CommentReply;
