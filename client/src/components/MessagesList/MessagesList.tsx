import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import $api from "../../http";
import { IMessage } from "../../interfaces/message.interface";
import Loader from "../UI/Loader/Loader";
import Message from "../UI/Message/Message";
import st from "./messages-list.module.scss";
import { useInfiniteQueryScrolling } from "../../hooks/useInfiniteScrolling";
import { firstMessageSentences } from "../../constants/firstMessageSentences";
import { useIsScrolling } from "../../hooks/useIsScrolling";

const MessagesList = ({
  socketMessages,
  roomId,
}: {
  socketMessages: IMessage[];
  roomId: string;
}) => {
  const [queryKey, setQueryKey] = React.useState(["messages", Date.now()]);
  const [randomSentence, setRandomSentence] = React.useState<number>(0);
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const ref = React.useRef<null | HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(queryKey, fetchMessages, {
      getNextPageParam: (lastPage) => {
        const { currentPage, totalPages } = lastPage.pagination;
        return currentPage + 1 === totalPages ? false : currentPage + 1;
      },
      retry: 0,
    });

  async function fetchMessages({ pageParam = 0 }) {
    const response = await $api.get(`/chat/${roomId}?page=${pageParam}`);
    return response.data;
  }

  useIsScrolling(setIsScrolling, ref);
  useInfiniteQueryScrolling(
    ref,
    async () => {
      if (ref.current) {
        let fromBottom = ref.current.scrollHeight - ref.current.scrollTop;
        if (!isFetchingNextPage && hasNextPage) {
          await fetchNextPage();
        }
        setTimeout(() => {
          if (ref.current)
            ref.current.scrollTop = ref.current.scrollHeight - fromBottom;
        }, 0);
      }
    },
    10,
    "reverse",
  );

  React.useEffect(() => {
    setRandomSentence(Math.floor(Math.random() * firstMessageSentences.length));
    setQueryKey(["messages", Date.now()]);
  }, [roomId]);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [socketMessages, isLoading]);

  return (
    <div
      ref={ref}
      className={isScrolling ? st.messages__scroll : st.messages__scroll_invis}
    >
      <div className={st.messages}>
        {isLoading ? (
          <div className={st.loader}>
            <Loader />
          </div>
        ) : data ? (
          <>
            {[...data.pages].reverse().map((page, index) => (
              <React.Fragment key={index}>
                {page.chat.messages.map((m: IMessage, index: number) => (
                  <React.Fragment key={index}>
                    <Message message={m} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            {socketMessages.map((m, index) => (
              <React.Fragment key={index}>
                <Message message={m} />
              </React.Fragment>
            ))}
          </>
        ) : socketMessages ? (
          <>
            {socketMessages.map((m, index) => (
              <React.Fragment key={index}>
                <Message message={m} />
              </React.Fragment>
            ))}
          </>
        ) : (
          <div>{firstMessageSentences[randomSentence]}</div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
