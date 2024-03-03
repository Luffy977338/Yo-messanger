import {
  useEffect,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
  Fragment,
} from "react";
import { useComment, useGetComments } from "../../hooks/CommentHooks";
import st from "./post-comments.module.scss";
import user from "../../store/user";
import Comment from "../Comment/Comment";
import Input from "../UI/Input/Input";
import { IoSend } from "react-icons/io5";
import Loader from "../UI/Loader/Loader";
import { useTreeLength } from "../../hooks/useTreeLength";
import { IComment } from "../../interfaces/comment.interface";
import CirclesLoader from "../UI/CirclesLoader/CirclesLoader";
import { QueryKey } from "@tanstack/react-query";

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
  const [queryKey, setQueryKey] = useState<QueryKey>([Date.now()]);

  useEffect(() => {
    setQueryKey([Date.now()]);
  }, []);

  const { isFetching, isLoading } = useGetComments(
    postId,
    setComments,
    queryKey,
  );
  const comment = useComment(postId);
  const treeLength = useTreeLength(comments, "replies");

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
      setCommentsCount(treeLength);
    }
  }, [comments, setCommentsCount, treeLength]);

  return (
    <div className={st.postComments}>
      <div className={st.comments}>
        {isLoading ? (
          <div>
            <CirclesLoader />
          </div>
        ) : (
          <>
            {!!comments.length &&
              comments?.map((com) => (
                <Fragment key={com._id}>
                  <Comment
                    style={{ paddingBottom: "20px" }}
                    comment={com}
                    comments={comments}
                  />
                </Fragment>
              ))}
          </>
        )}
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
            disabled={comment.isLoading || (!message && !pictures.length)}
            style={
              !message && !pictures.length
                ? { color: "#474747", cursor: "default" }
                : {}
            }
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
