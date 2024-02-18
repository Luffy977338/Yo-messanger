import {
  useEffect,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
  Fragment,
} from "react";
import { useComment, useGetComments } from "../../hooks/CommentHooks";
import { IComment } from "../../interfaces/comment.interface";
import st from "./post-comments.module.scss";
import user from "../../store/user";
import Comment from "../Comment/Comment";
import Input from "../UI/Input/Input";
import { IoSend } from "react-icons/io5";
import Loader from "../UI/Loader/Loader";

const PostComments = ({
  postId,
  setCommentsCount,
}: {
  postId: string;
  setCommentsCount: Dispatch<SetStateAction<number>>;
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [message, setMessage] = useState<string>("");
  const [pictures, setPictures] = useState<File[]>([]);

  const { isFetching } = useGetComments(postId, setComments);
  const comment = useComment(postId);

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (comment.isLoading) return;
    if (!message && !pictures.length) return;

    await comment.mutateAsync({ message, pictures });

    setMessage("");
    setPictures([]);
  };

  useEffect(() => {
    if (!isFetching) {
      setCommentsCount(comments.length);
    }
  }, [comments, setCommentsCount]);

  return (
    <div className={st.postComments}>
      <div className={st.comments}>
        {comments?.map((com) => (
          <Fragment key={com._id}>
            <Comment style={{ marginBottom: "25px" }} comment={com} />
          </Fragment>
        ))}
      </div>
      <div className={st.input}>
        <img src={user.user.avatar} alt='' />
        <form className={st.form} onSubmit={handleForm}>
          <Input
            className={st.form__input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type='text'
            placeholder='Прокомментируйте...'
          />
          <button
            className={st.sendButton}
            disabled={comment.isLoading}
            type='submit'
          >
            {comment.isLoading ? (
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

export default PostComments;
