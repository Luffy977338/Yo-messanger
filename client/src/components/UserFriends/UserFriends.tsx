import { useNavigate } from "react-router-dom";
import $api from "../../http";
import { IUser } from "../../interfaces/user.interface";
import st from "./user-friends.module.scss";
import { observer } from "mobx-react-lite";
import user from "../../store/user";
import LoadFriend from "../UI/LoadFriend/LoadFriend";
import { useQuery } from "@tanstack/react-query";

interface UserFriendsProps {
  id: string | undefined;
}

const UserFriends = ({ id }: UserFriendsProps) => {
  const path = useNavigate();

  const { data, isLoading } = useQuery(
    ["friends", id],
    () => {
      return $api.get(`/${id}`);
    },
    { select: (data) => data.data },
  );

  return (
    <aside className={st.aside__wrap}>
      <div className={st.myFriends}>
        {data?.username === user.user.username ? (
          <p>Мои друзья</p>
        ) : (
          <p>Друзья {isLoading ? "" : `${data.username}`}</p>
        )}
      </div>
      <hr />
      <div className={st.friends__list}>
        {isLoading ? (
          <LoadFriend />
        ) : (
          <>
            {data?.friends?.length ? (
              <div>
                {data?.friends.map((sub: IUser, index: number) => {
                  if (index < 3) {
                    return (
                      <div
                        onClick={() => {
                          path(`/${sub._id}`);
                        }}
                        key={sub._id}
                        className={st.friend}
                      >
                        <img
                          draggable={false}
                          className={st.friend__avatar}
                          src={
                            sub.avatar ||
                            `../../../public/assets/images/default-user-avatar.jpg`
                          }
                          alt=''
                        />
                        <p className={st.friend__username}>{sub.username}</p>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            ) : (
              <div>Друзей нет</div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default observer(UserFriends);
