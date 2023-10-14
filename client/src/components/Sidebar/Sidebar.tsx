import React from "react";
import { useNavigate } from "react-router-dom";
import user from "../../store/user";
import st from "./sidebar.module.scss";
import { BiUserCircle } from "react-icons/bi";
import { HiOutlineNewspaper } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";
import { TbMessageCircle2 } from "react-icons/tb";
import { observer } from "mobx-react-lite";

const Sidebar = () => {
   const [prevScrollPos, setPrevScrollPos] = React.useState(0);
   const [headerVisible, setHeaderVisible] = React.useState(true);

   const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setHeaderVisible(currentScrollPos < prevScrollPos);
      setPrevScrollPos(currentScrollPos);
   };

   React.useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, [prevScrollPos]);
   const path = useNavigate();

   return (
      <nav
         className={[
            st.sidebar,
            headerVisible ? "" : st.sidebar__scrolled,
         ].join(" ")}
      >
         <div
            className={st.option}
            onClick={() => {
               path(`/${user.user._id}`);
            }}
         >
            <div className={st.icon}>
               <BiUserCircle />
            </div>
            Мой профиль
         </div>
         <div
            className={st.option}
            onClick={() => {
               path("/posts");
            }}
         >
            <div className={st.icon}>
               <HiOutlineNewspaper />
            </div>
            Новости
         </div>
         <div
            className={st.option}
            onClick={() => {
               path("/messages");
            }}
         >
            <div className={st.icon}>
               <TbMessageCircle2 />
            </div>
            Сообщения
         </div>
         <div
            className={st.option}
            onClick={() => {
               path(`/friends/${user.user._id}`);
            }}
         >
            <div className={st.icon}>
               <FaUserFriends />
            </div>
            Друзья
         </div>
      </nav>
   );
};

export default observer(Sidebar);
