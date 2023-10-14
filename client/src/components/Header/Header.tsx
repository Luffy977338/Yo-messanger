import React from "react";
import st from "./header.module.scss";
import { useNavigate } from "react-router-dom";
import { MdExpandMore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import ProfileBar from "../ProfileBar/ProfileBar";
import { API_URL } from "../../http";
import user from "../../store/user";

const Header = () => {
   const [isClicked, setIsClicked] = React.useState(false);
   const profileImgRef = React.useRef<null | HTMLDivElement>(null);
   const profileRef = React.useRef<null | HTMLDivElement>(null);
   const path = useNavigate();

   const _handleClickAway = (event: any) => {
      if (
         profileRef.current &&
         !profileRef.current.contains(event.target) &&
         profileImgRef.current &&
         !profileImgRef.current.contains(event.target)
      ) {
         setIsClicked(false);
      }
   };

   const MProfileBar = {
      from: {
         opacity: 0,
         y: 10,
      },
      to: {
         opacity: 1,
         y: 0,
      },
   };

   React.useEffect(() => {
      document.addEventListener("mousedown", _handleClickAway);
      return () => {
         document.removeEventListener("mousedown", _handleClickAway);
      };
   });

   const avatar = `${API_URL}/${user.user.avatar}`;

   return (
      <header className={st.header__wrap}>
         <div className={st.header}>
            <div className={st.logo} onClick={() => path("/posts")}>
               <span>Y</span>
               <span>O</span>
               <span>!</span>
            </div>
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
         </div>
         <AnimatePresence mode='wait'>
            {isClicked ? (
               <motion.div
                  variants={MProfileBar}
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

export default Header;
