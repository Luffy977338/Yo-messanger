import React from "react";
import user from "../../store/user";
import { useSubscribe } from "../../hooks/FriendshipHooks";
import { observer } from "mobx-react-lite";
import st from "./Friendship.module.scss";
import { AnimatePresence } from "framer-motion";
import FriendOptions from "./FriendOptions";
import SubscriptionOptions from "./SubscriptionOptions";
import SubscriberOptions from "./SubscriberOptions";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import $api from "../../http";
import { IUser } from "../../interfaces/user.interface";

const Friendship = () => {
   const { id: userId } = useParams();
   const id = userId !== undefined ? userId.toString() : "";
   const { data, isLoading } = useQuery(
      ["friends", userId],
      () => {
         return $api.get(`/${id}`);
      },
      { select: (data) => data.data, keepPreviousData: true },
   );
   const [isHover, setIsHover] = React.useState<boolean>(false);
   const subscribe = useSubscribe(id);

   const isFriend = () => {
      if (data && data.friends && !isLoading) {
         return data.friends.some(
            (friend: IUser) => friend._id === user.user._id,
         );
      }
      return false;
   };

   const isSubscribed = () => {
      if (data && data.subscribers && !isLoading) {
         return data.subscribers.some(
            (sub: IUser) => sub._id === user.user._id,
         );
      }
      return false;
   };

   const isSubscriber = () => {
      if (data && data.subscriptions && !isLoading) {
         return data.subscriptions.some(
            (sub: IUser) => sub._id === user.user._id,
         );
      }
      return false;
   };

   return (
      <div className={st.friendship}>
         {isFriend() ? (
            <div>
               <div>
                  <button
                     onMouseEnter={() => setIsHover(true)}
                     onMouseLeave={() => setIsHover(false)}
                     className={st.friendship__status}
                  >
                     В друзьях
                  </button>
               </div>
               <AnimatePresence mode='wait'>
                  {isHover ? (
                     <FriendOptions
                        id={id}
                        setIsHover={setIsHover}
                        isHover={isHover}
                     />
                  ) : (
                     ""
                  )}
               </AnimatePresence>
            </div>
         ) : isSubscribed() ? (
            <div>
               <button
                  className={st.friendship__status}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
               >
                  Заявка отправленна
               </button>
               <AnimatePresence mode='wait'>
                  {isHover ? (
                     <SubscriptionOptions
                        id={id}
                        setIsHover={setIsHover}
                        isHover={isHover}
                     />
                  ) : (
                     ""
                  )}
               </AnimatePresence>
            </div>
         ) : isSubscriber() ? (
            <div>
               <button
                  className={st.friendship__status}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
               >
                  Ответить на заявку
               </button>
               <AnimatePresence mode='wait'>
                  {isHover ? (
                     <SubscriberOptions
                        id={id}
                        setIsHover={setIsHover}
                        isHover={isHover}
                     />
                  ) : (
                     ""
                  )}
               </AnimatePresence>
            </div>
         ) : (
            <div>
               <button
                  className={st.friendship__status}
                  onClick={() => subscribe.mutateAsync()}
                  disabled={isLoading || subscribe.isLoading}
               >
                  Отправить заявку
               </button>
            </div>
         )}
      </div>
   );
};

export default observer(Friendship);
