import { FC, HTMLProps } from "react";
import { IComment } from "../../interfaces/comment.interface";
import st from "./comment.module.scss";
import user from "../../store/user";
import { useDeleteComment } from "../../hooks/CommentHooks";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

interface CommentProps extends HTMLProps<HTMLDivElement> {
  comment: IComment;
}

const Comment: FC<CommentProps> = ({
  comment,
  ...options
}: {
  comment: IComment;
}) => {
  const canDelete =
    comment.post.userCreator._id === user.user._id ||
    comment.user._id === user.user._id;

  const path = useNavigate();

  const deleteComment = useDeleteComment();

  return (
    <div {...options} className={st.comment}>
      <div className={st.comment__main}>
        <img
          className={st.comment__avatar}
          src={comment.user.avatar}
          alt=''
          onClick={() => path(`/${comment.user._id}`)}
        />
        <div className={st.comment__content}>
          <div
            className={st.comment__content_username}
            onClick={() => path(`/${comment.user._id}`)}
          >
            {comment.user.username}
          </div>
          <div className={st.comment__content_message}>{comment.message}</div>
          <div className={st.comment__content_message}>{comment.pictures}</div>
        </div>
      </div>
      <div className={st.options}>
        {canDelete ? (
          <div className={st.comment__delete}>
            <button
              title='Удалить'
              className={st.comment__delete_button}
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
    </div>
  );
};

export default Comment;
