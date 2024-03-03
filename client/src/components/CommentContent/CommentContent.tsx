import { usePostDate } from "../../hooks/PostHooks";
import { IComment } from "../../interfaces/comment.interface";
import st from "./comment-content.module.scss";
import { useDeleteComment } from "../../hooks/CommentHooks";
import user from "../../store/user";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { Dispatch, HTMLProps, RefObject, SetStateAction } from "react";
import CommentLikeButton from "../CommentLikeButton/CommentLikeButton";

interface CommentContentProps extends HTMLProps<HTMLDivElement> {
  comment: IComment;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  setMessage: Dispatch<SetStateAction<string>>;
  mainSt: CSSModuleClasses;
}

const CommentContent = ({
  comment,
  setIsReply,
  formRef,
  inputRef,
  setMessage,
  mainSt,
  ...options
}: CommentContentProps) => {
  const path = useNavigate();
  const date = usePostDate(comment.createdAt);
  const deleteComment = useDeleteComment();

  const canDelete =
    comment.post.userCreator._id === user.user._id ||
    comment.user._id === user.user._id;

  return (
    <div className={st.comment} {...options}>
      <div className={st.comment__main}>
        <div
          onClick={() => path(`/${comment.user._id}`)}
          className={st.comment__username}
        >
          <span>{comment.user.username}</span>
        </div>
        {canDelete ? (
          <div className={mainSt.comment__delete}>
            <button
              title='Удалить'
              className={mainSt.comment__delete_button}
              disabled={deleteComment.isLoading}
              onClick={() => {
                canDelete ? deleteComment.mutateAsync(comment._id) : null;
              }}
            >
              <RxCross2 />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={st.comment__content}>
        <div className={st.comment__content_message}>{comment.message}</div>
        <div className={st.comment__content_pictures}>{comment.pictures}</div>
      </div>
      <div className={st.comment__additionally}>
        <div style={{ display: "flex" }}>
          <div className={st.comment__additionally_date}>{date}</div>
          <div className={st.comment__additionally_reply}>
            <button
              onClick={() => {
                setIsReply(true);
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                inputRef.current?.focus();
                setMessage(
                  comment.user._id !== user.user._id
                    ? `${comment.user.username}, `
                    : "",
                );
              }}
            >
              Ответить
            </button>
          </div>
        </div>
        <CommentLikeButton mainSt={mainSt} comment={comment} />
      </div>
    </div>
  );
};

export default CommentContent;
