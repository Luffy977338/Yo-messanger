import { useParams } from "react-router-dom";
import user from "../../store/user";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import LoadPost from "../../components/UI/LoadPost/LoadPost";
import Post from "../../components/Post/Post";
import UserBanner from "../../components/UI/UserBanner/UserBanner";
import UserFriends from "../../components/UserFriends/UserFriends";
import { useInfiniteQueryScrolling } from "../../hooks/useInfiniteScrolling";
import $api from "../../http";
import { IPost } from "../../interfaces/post.interface";
import st from "./user-posts.module.scss";
import Form from "../../components/Form/Form";

const UserPosts = () => {
  const { id } = useParams();
  const [queryKey, setQueryKey] = React.useState(["posts", id, Date.now()]);
  const isMyPage = id === user.user._id;
  const perPage = 8;
  const [page, setPage] = React.useState<number>(1);
  const limit = perPage * page;

  React.useEffect(() => {
    setQueryKey(["posts", id, Date.now()]);
    setPage(1);
  }, [id]);

  async function fetchPosts() {
    const response = await $api.get(`/${id}`);
    return response.data;
  }

  const { data, isLoading } = useQuery(queryKey, fetchPosts, {});

  useInfiniteQueryScrolling(
    document,
    () => {
      setPage(page + 1);
    },
    1200,
  );

  return (
    <div>
      <UserBanner />
      <div style={{ display: "flex" }}>
        <div className={st.user}>
          <div style={{ display: "flex" }}>
            <div>
              {isMyPage && (
                <Form setQueryKey={setQueryKey} isLoading={isLoading} />
              )}
              {isLoading ? (
                <LoadPost />
              ) : (
                <div className={st.userPosts}>
                  {data.posts?.length ? (
                    <>
                      {data.posts.map((post: IPost, index: number) => {
                        if (index <= limit) {
                          return (
                            <Post
                              key={post._id}
                              userCreator={data}
                              canDelete={isMyPage}
                              post={post}
                              setQueryKey={setQueryKey}
                            />
                          );
                        }
                        return "";
                      })}
                    </>
                  ) : (
                    <div>Нет постов</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <UserFriends id={id} />
        </div>
      </div>
    </div>
  );
};

export default observer(UserPosts);
