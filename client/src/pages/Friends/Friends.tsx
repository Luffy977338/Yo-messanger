import React from "react";
import st from "./friends.module.scss";
import FriendshipUser from "../../components/UI/FriendshipUser/FriendshipUser";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import $api from "../../http";
import Loader from "../../components/UI/Loader/Loader";
import { IUser } from "../../interfaces/user.interface";

const Friends = () => {
  const { id } = useParams();
  const [type, setType] = React.useState<
    "friends" | "subscribers" | "subscriptions"
  >("friends");

  const { isFetching, data } = useQuery(
    ["friends", id],
    () => {
      return $api.get(`/${id}`);
    },
    { select: (data) => data.data },
  );

  return (
    <div className={st.friends__wrap}>
      <nav className={st.panel__navigation}>
        <div
          className={`${st.panel__background} ${
            type === "subscribers" ? st.panel__background_subscribers : ""
          } ${
            type === "subscriptions" ? st.panel__background_subscriptions : ""
          }`}
        />
        <div onClick={() => setType("friends")}>Друзья</div>
        <div onClick={() => setType("subscribers")}>Подписчики</div>
        <div onClick={() => setType("subscriptions")}>Подписки</div>
      </nav>
      <hr />
      <div>
        {isFetching ? (
          <Loader />
        ) : (
          <>
            {type === "friends" ? (
              <>
                {data?.friends.length > 0 ? (
                  <div className={st.users}>
                    {data?.friends.map((user: IUser) => (
                      <FriendshipUser key={user._id} type={type} user={user} />
                    ))}
                  </div>
                ) : (
                  <div>Нет друзей</div>
                )}
              </>
            ) : type === "subscribers" ? (
              <>
                {data?.subscribers.length > 0 ? (
                  <div className={st.users}>
                    {data?.subscribers.map((user: IUser) => (
                      <FriendshipUser key={user._id} type={type} user={user} />
                    ))}
                  </div>
                ) : (
                  <div>Нет подписчиков</div>
                )}
              </>
            ) : type === "subscriptions" ? (
              <>
                {data?.subscriptions.length > 0 ? (
                  <div className={st.users}>
                    {data?.subscriptions.map((user: IUser) => (
                      <FriendshipUser key={user._id} type={type} user={user} />
                    ))}
                  </div>
                ) : (
                  <div>Нет подписок</div>
                )}
              </>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default observer(Friends);
