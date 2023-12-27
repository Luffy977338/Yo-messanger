import React from "react";
import st from "./header.module.scss";
import { useNavigate } from "react-router-dom";
import { MdExpandMore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import ProfileBar from "../ProfileBar/ProfileBar";
import { API_URL } from "../../http";
import user from "../../store/user";
import Notifications from "./../Notifications/Notifications";
import PopUpAnimation from "../../animations/PopUp.animation";
import { useClickAway } from "../../hooks/useClickAway";
import { observer } from "mobx-react-lite";

const Header = () => {
  const [isProfileClicked, setIsProfileClicked] = React.useState(false);
  const profileImgRef = React.useRef<null | HTMLDivElement>(null);
  const profileRef = React.useRef<null | HTMLDivElement>(null);
  const path = useNavigate();

  useClickAway(setIsProfileClicked, [profileImgRef, profileRef]);

  const avatar = `${API_URL}/${user.user.avatar}`;

  return (
    <header className={st.header__wrap}>
      <div className={st.header}>
        <div className={st.header__left}>
          <div className={st.logo} onClick={() => path("/posts")}>
            <span>Y</span>
            <span>O</span>
            <span>!</span>
          </div>
          <Notifications />
        </div>
        <div
          ref={profileImgRef}
          className={[
            st.user__avatar,
            isProfileClicked ? st.user__avatar_focus : "",
          ].join(" ")}
          onClick={() => setIsProfileClicked(!isProfileClicked)}
        >
          <img
            draggable={false}
            className={st.user__avatar_img}
            src={avatar}
            alt=''
          />
          <MdExpandMore
            style={{
              color: "var(--secondary-color)",
              fontSize: "28px",
            }}
          />
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {isProfileClicked ? (
          <motion.div
            variants={PopUpAnimation}
            initial='from'
            animate='to'
            exit='from'
            transition={{ duration: 0.1 }}
            className={st.profile}
            ref={profileRef}
          >
            <ProfileBar />
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
    </header>
  );
};

export default observer(Header);
