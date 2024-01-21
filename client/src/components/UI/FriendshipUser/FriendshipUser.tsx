import React from "react";
import st from "./friendship-user.module.scss";
import { IUser } from "../../../interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import FriendOptions from "../../Friendship/FriendOptions";
import { AnimatePresence } from "framer-motion";
import SubscriberOptions from "../../Friendship/SubscriberOptions";
import SubscriptionOptions from "../../Friendship/SubscriptionOptions";
import { observer } from "mobx-react-lite";

interface UserProps {
  user: IUser;
  type: string;
}

const FriendshipUser = ({ user, type }: UserProps) => {
  const [isHover, setIsHover] = React.useState(false);
  const path = useNavigate();

  return (
    <div className={st.user__wrap}>
      <div className={st.user}>
        <img
          draggable={false}
          className={st.user__avatar}
          src={
            user.avatar ||
            `../../../public/assets/images/default-user-avatar.jpg`
          }
          alt=''
        />
        <p
          onClick={() => {
            path(`/${user._id}`);
          }}
          className={st.user__username}
        >
          {user.username}
        </p>
      </div>
      <div>
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className={st.dots}
        >
          <FiMoreHorizontal />
        </div>
        {type === "friends" ? (
          <AnimatePresence mode='wait'>
            {isHover ? (
              <div className={st.options__wrap}>
                <FriendOptions
                  setIsHover={setIsHover}
                  isHover={isHover}
                  id={user._id}
                />
              </div>
            ) : (
              ""
            )}
          </AnimatePresence>
        ) : type === "subscribers" ? (
          <AnimatePresence mode='wait'>
            {isHover ? (
              <div className={st.options__wrap}>
                <SubscriberOptions
                  setIsHover={setIsHover}
                  isHover={isHover}
                  id={user._id}
                />
              </div>
            ) : (
              ""
            )}
          </AnimatePresence>
        ) : type === "subscriptions" ? (
          <AnimatePresence mode='wait'>
            {isHover ? (
              <div className={st.options__wrap}>
                <SubscriptionOptions
                  setIsHover={setIsHover}
                  isHover={isHover}
                  id={user._id}
                />
              </div>
            ) : (
              ""
            )}
          </AnimatePresence>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default observer(FriendshipUser);
