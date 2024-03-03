import { Dispatch, Fragment, RefObject, SetStateAction, useState } from "react";
import { IComment } from "../../interfaces/comment.interface";
import CommentReply from "../Comment/CommentReply";
import { IoIosArrowUp } from "react-icons/io";
import { useGetCommentReplies } from "../../hooks/CommentHooks";
import st from "./comment-replies.module.scss";

interface CommentRepliesProps {
  comment: IComment;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  commentRef: RefObject<HTMLDivElement>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const CommentReplies = ({
  comment,
  setIsReply,
  formRef,
  inputRef,
  commentRef,
  setMessage,
}: CommentRepliesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetCommentReplies([comment._id], comment._id);

  return (
    <>
      {comment.replies.length ? (
        <>
          {isOpen && !isLoading ? (
            <div
              style={{
                position: "relative",
                marginLeft: "52px",
              }}
            >
              <div
                className={st.collapse__wrap}
                onClick={() => {
                  commentRef.current?.scrollIntoView({ block: "center" });
                  setIsOpen(false);
                }}
              >
                <span>
                  <IoIosArrowUp />
                </span>
              </div>
              <div>
                {data?.pages?.map((page, index) => (
                  <Fragment key={index}>
                    {page.replies?.map((rep: IComment) => (
                      <Fragment key={rep._id}>
                        <CommentReply
                          setMessage={setMessage}
                          setIsReply={setIsReply}
                          formRef={formRef}
                          inputRef={inputRef}
                          comment={rep}
                          style={{
                            paddingBottom: "20px",
                            borderTop: "1px solid var(--primary-color)",
                          }}
                        />
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
                {hasNextPage ? (
                  <button
                    onClick={() => {
                      if (!isFetchingNextPage && !isLoading && hasNextPage) {
                        fetchNextPage();
                      }
                    }}
                    className={st.showMore}
                  >
                    Показать еще
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                style={{ display: "flex", marginBottom: "20px" }}
                onClick={() => setIsOpen(true)}
                className={st.showAnswers}
              >
                Посмотреть ответы {`(${comment.replies.length})`}
              </button>
            </>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CommentReplies;
