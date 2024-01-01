import { useInfiniteQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import Post from "../../components/Post/Post";
import st from "./all-posts.module.scss";
import Form from "../../components/Form/Form";
import $api from "../../http";
import { IPost } from "../../interfaces/post.interface";
import UserFriends from "../../components/UserFriends/UserFriends";
import user from "../../store/user";
import LoadPost from "../../components/UI/LoadPost/LoadPost";
import React from "react";
import { useInfiniteQueryScrolling } from "../../hooks/useInfiniteScrolling";

const AllPosts = () => {
  const [queryKey, setQueryKey] = React.useState(["posts", Date.now()]);
  React.useEffect(() => {
    setQueryKey(["posts", Date.now()]);
  }, []);

  useInfiniteQueryScrolling(
    document,
    () => {
      if (!isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    },
    1200,
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(queryKey, fetchPosts, {
      getNextPageParam: (lastPage) => {
        const { currentPage, totalPages } = lastPage.pagination;
        return currentPage + 1 === totalPages ? false : currentPage + 1;
      },
    });

  async function fetchPosts({ pageParam = 0 }) {
    const response = await $api.get(`/posts?page=${pageParam}`);
    return response.data;
  }

  return (
    <div style={{ display: "flex" }}>
      <div className={st.all}>
        <Form setQueryKey={setQueryKey} isLoading={isLoading} />
        {isLoading ? (
          <LoadPost />
        ) : (
          <div className={st.allPosts}>
            {data?.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.posts.map((post: IPost) => (
                  <Post
                    key={post._id}
                    post={post}
                    userCreator={post.userCreator}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <div>
        <UserFriends id={user.user._id} />
      </div>
    </div>
  );
};

export default observer(AllPosts);
