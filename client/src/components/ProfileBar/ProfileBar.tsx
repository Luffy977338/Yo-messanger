import user from "../../store/user";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../service/auth.service";
import st from "./profile-bar.module.scss";
import { MdExpandMore, MdOutlineLogout } from "react-icons/md";
import errors from "../../store/errors";
import { API_URL } from "../../http";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import PopUpAnimation from "../../animations/PopUp.animation";
import { useState, useRef } from "react";
import { useClickAway } from "../../hooks/useClickAway";

const ProfileBar = () => {
  const path = useNavigate();
  const logoutMutation = useMutation(AuthService.logout, {
    onSuccess: () => {
      localStorage.removeItem("token");
      errors.makeErrorEmpty();
    },
  });
  const avatar = `${API_URL}/${user.user.avatar}`;
  const [isClicked, setIsClicked] = useState(false);
  const profileImgRef = useRef<null | HTMLDivElement>(null);
  const profileRef = useRef<null | HTMLDivElement>(null);

  useClickAway(setIsClicked, [profileImgRef, profileRef]);

  return (
    <>
      <div
        ref={profileImgRef}
        className={[
          st.user__avatar,
          isClicked ? st.user__avatar_focus : "",
        ].join(" ")}
        onClick={() => setIsClicked(!isClicked)}
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
      <AnimatePresence mode='wait'>
        {isClicked ? (
          <motion.div
            variants={PopUpAnimation}
            initial='from'
            animate='to'
            exit='from'
            transition={{ duration: 0.1 }}
            className={st.profile}
            ref={profileRef}
          >
            <div className={st.user}>
              <img
                draggable={false}
                className={st.user__img}
                src={avatar}
                alt=''
              />
              <div className={st.user__username}>
                <p>{user.user.username}</p>
                <p>{user.user.email}</p>
              </div>
            </div>
            <div
              onClick={() => {
                setIsClicked(false);
                path(`/settings`);
              }}
              className={st.user__logout}
            >
              <IoSettingsOutline
                style={{ fontSize: "28px", color: "var(--blue-icon)" }}
              />
              <button>Настройки</button>
            </div>
            <div
              className={st.user__logout}
              onClick={() => {
                logoutMutation.mutateAsync();
                setIsClicked(false);
                path("/auth");
              }}
            >
              <MdOutlineLogout style={{ fontSize: "28px", color: "#dc2f2f" }} />
              <button>Выйти</button>
            </div>
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
    </>
  );
};

export default observer(ProfileBar);
