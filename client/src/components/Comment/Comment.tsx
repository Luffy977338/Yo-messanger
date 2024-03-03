import { FC, HTMLProps, useRef, useState } from "react";
import { IComment } from "../../interfaces/comment.interface";
import st from "./comment.module.scss";
import { useNavigate } from "react-router-dom";
import CommentReplyForm from "./../CommentReplyForm/CommentReplyForm";
import CommentContent from "../CommentContent/CommentContent";
import CommentReplies from "../CommentReplies/CommentReplies";

interface CommentProps extends HTMLProps<HTMLDivElement> {
  comment: IComment;
  comments: IComment[];
}

const Comment: FC<CommentProps> = ({ comment, comments, ...options }) => {
  const [isReply, setIsReply] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const isFirstComment = comments[0] === comment;

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);

  const path = useNavigate();

  return (
    <>
      <div ref={commentRef} {...options} className={st.comment}>
        <div>
          <img
            style={isFirstComment ? { transform: "translateY(0)" } : {}}
            className={st.comment__avatar}
            src={comment.user.avatar}
            alt=''
            onClick={() => path(`/${comment.user._id}`)}
          />
        </div>
        <CommentContent
          style={{
            borderTop: !isFirstComment
              ? "1px solid var(--primary-color)"
              : "none",
            paddingTop: !isFirstComment ? "20px" : "0",
          }}
          mainSt={st}
          setIsReply={setIsReply}
          setMessage={setMessage}
          formRef={formRef}
          inputRef={inputRef}
          comment={comment}
        />
      </div>
      <div>
        <div>
          <CommentReplies
            comment={comment}
            commentRef={commentRef}
            inputRef={inputRef}
            formRef={formRef}
            setMessage={setMessage}
            setIsReply={setIsReply}
          />
          <div style={{ paddingLeft: 52 }}>
            <CommentReplyForm
              message={message}
              setMessage={setMessage}
              comment={comment}
              formRef={formRef}
              inputRef={inputRef}
              isReply={isReply}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Comment;
