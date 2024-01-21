import React from "react";
import st from "./edit-avatar-field.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import user from "../../../store/user";
import { observer } from "mobx-react-lite";

const EditAvatarField = ({
  avatar,
  setAvatar,
}: {
  avatar: File | null | undefined;
  setAvatar: React.Dispatch<React.SetStateAction<File | null | undefined>>;
}) => {
  const [isHover, setIsHover] = React.useState<boolean>(false);
  return (
    <>
      <div
        className={st.avatar__wrap}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <img
          className={st.avatar}
          src={
            avatar !== null && avatar !== undefined
              ? URL.createObjectURL(avatar)
              : avatar === null
              ? `${user.user.avatar}`
              : `../../../public/assets/images/default-user-avatar.jpg`
          }
          width={100}
          draggable={false}
          alt=''
        />
      </div>
      <AnimatePresence mode='wait'>
        {isHover ? (
          <motion.div
            initial='from'
            animate='to'
            exit='from'
            variants={{ from: { opacity: 0 }, to: { opacity: 1 } }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div className={st.changeAvatarOptions}>
              <label htmlFor='avatar'>
                <div
                  onClick={() => setIsHover(false)}
                  className={st.changeAvatarOptions__change}
                >
                  Изменить аватар
                </div>
              </label>
              <div
                onClick={() => {
                  setAvatar(undefined);
                  setIsHover(false);
                }}
                className={st.changeAvatarOptions__delete}
              >
                Удалить аватар
              </div>
            </div>
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
    </>
  );
};

export default observer(EditAvatarField);
