import { motion } from "framer-motion";
import React, { SetStateAction } from "react";
import st from "./Friendship.module.scss";
import { useUnsubscribe } from "../../hooks/FriendshipHooks";
import { observer } from "mobx-react-lite";

interface SubscriptionOptionsProps {
   setIsHover: React.Dispatch<SetStateAction<boolean>>;
   isHover: boolean;
   id: string;
}

const SubscriptionOptions = ({
   setIsHover,
   isHover,
   id,
}: SubscriptionOptionsProps) => {
   const unsubscribe = useUnsubscribe(id);

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
               disabled={unsubscribe.isLoading}
               onClick={() => {
                  setIsHover(false);
                  unsubscribe.mutateAsync();
               }}
            >
               Убрать заявку
            </button>
         </div>
      </motion.div>
   );
};

export default observer(SubscriptionOptions);
