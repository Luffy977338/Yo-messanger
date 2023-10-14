import { motion } from "framer-motion";
import React, { SetStateAction } from "react";
import st from "./Friendship.module.scss";
import { useDeleteFriend } from "../../hooks/FriendshipHooks";
import { observer } from "mobx-react-lite";

interface FriendOptionsProps {
   setIsHover: React.Dispatch<SetStateAction<boolean>>;
   isHover: boolean;
   id: string;
}

const FriendOptions = ({ setIsHover, isHover, id }: FriendOptionsProps) => {
   const deleteFriend = useDeleteFriend(id);

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
               disabled={deleteFriend.isLoading}
               onClick={() => {
                  setIsHover(false);
                  deleteFriend.mutateAsync();
               }}
            >
               Удалить из друзей
            </button>
         </div>
      </motion.div>
   );
};

export default observer(FriendOptions);
