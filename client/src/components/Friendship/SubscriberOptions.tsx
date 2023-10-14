import { motion } from "framer-motion";
import React, { SetStateAction } from "react";
import st from "./Friendship.module.scss";
import { useAcceptFriend, useRejectFriend } from "../../hooks/FriendshipHooks";
import { observer } from "mobx-react-lite";

interface SubscriberOptionsProps {
   setIsHover: React.Dispatch<SetStateAction<boolean>>;
   isHover: boolean;
   id: string;
}

const SubscriberOptions = ({
   setIsHover,
   isHover,
   id,
}: SubscriberOptionsProps) => {
   const acceptFriend = useAcceptFriend(id);
   const rejectFriend = useRejectFriend(id);

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: isHover ? 1 : 0 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.1 }}
         className={st.friendship__wrap}
         onMouseEnter={() => setIsHover(true)}
         onMouseLeave={() => setIsHover(false)}
      >
         <div className={st.friendship__block}>
            <button
               className={st.friendship__block_button}
               disabled={acceptFriend.isLoading || rejectFriend.isLoading}
               onClick={() => {
                  setIsHover(false);
                  acceptFriend.mutateAsync();
               }}
            >
               Принять
            </button>
            <button
               className={st.friendship__block_button}
               disabled={acceptFriend.isLoading || rejectFriend.isLoading}
               onClick={() => {
                  setIsHover(false);
                  rejectFriend.mutateAsync();
               }}
            >
               Отклонить
            </button>
         </div>
      </motion.div>
   );
};

export default observer(SubscriberOptions);
