import { useParams } from "react-router-dom";
import user from "../../store/user";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import LoadPost from "../../components/UI/LoadPost/LoadPost";
import Post from "../../components/Post/Post";
import UserBanner from "../../components/UserBanner/UserBanner";
import UserFriends from "../../components/UserFriends/UserFriends";
import { useInfiniteQueryScrolling } from "../../hooks/useInfiniteScrolling";
import st from "./user-posts.module.scss";
import Form from "../../components/Form/Form";
import { useGetUserPosts } from "../../hooks/PostHooks";
import { IPost } from "../../interfaces/post.interface";
import { useUser } from "../../hooks/useUser";
import ProfileClosed from "../../components/UI/ProfileClosed/ProfileClosed";
import { Helmet } from "react-helmet";

type profileClosedError = { response: { data: { closedProfile: boolean } } };

const UserPosts = () => {
  const { id } = useParams();
  const [queryKey, setQueryKey] = React.useState(["posts", id, Date.now()]);
  const isMyPage = id === user.user._id;

  React.useEffect(() => {
    setQueryKey(["posts", id, Date.now()]);
  }, [id]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error: dataError,
  } = useGetUserPosts(queryKey, id);
  const error = dataError as profileClosedError | null;

  useInfiniteQueryScrolling(
    document,
    () => {
      if (!isFetchingNextPage && hasNextPage && isFetching) {
        fetchNextPage();
      }
    },
    1400,
  );

  const { data: userData, isLoading: userLoading } = useUser({
    userId: id as string,
  });

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
              {isLoading || userLoading ? (
                <LoadPost />
              ) : (
                <div className={st.userPosts}>
                  <Helmet title={`${userData?.username} | Yo`} />
                  {(() => {
                    if (error?.response.data.closedProfile) {
                      return <ProfileClosed username={userData?.username} />;
                    }
                    if (!data?.pages[0].posts.length) {
                      return `${
                        userData?.username === user.user.username
                          ? "У вас"
                          : userData?.username
                          ? `у ${userData.username}`
                          : "Тут"
                      } пока что нет постов`;
                    }
                    return (
                      <>
                        {data.pages.map((page, pageIndex) => (
                          <Fragment key={pageIndex}>
                            {page.posts.map((post: IPost) => (
                              <Post
                                canDelete={isMyPage}
                                post={post}
                                key={post._id}
                                userCreator={post.userCreator}
                                beforeDelete={() =>
                                  setQueryKey(["posts", id, Date.now()])
                                }
                              />
                            ))}
                          </Fragment>
                        ))}
                      </>
                    );
                  })()}
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
