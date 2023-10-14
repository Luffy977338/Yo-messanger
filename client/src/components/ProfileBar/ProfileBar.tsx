import user from "../../store/user";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../service/auth-service";
import st from "./profile-bar.module.scss";
import { MdOutlineLogout } from "react-icons/md";
import errors from "../../store/errors";
import { API_URL } from "../../http";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const ProfileBar = () => {
   const path = useNavigate();
   const logoutMutation = useMutation(AuthService.logout, {
      onSuccess: () => {
         localStorage.removeItem("token");
         errors.makeErrorEmpty();
      },
   });

   const avatar = `${API_URL}/${user.user.avatar}`;

   return (
      <div>
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
            className={st.user__logout}
            onClick={() => {
               logoutMutation.mutateAsync();
               path("/auth");
            }}
         >
            <MdOutlineLogout
               style={{ fontSize: "28px", color: "var(--blue-icon)" }}
            />
            <button>Выйти</button>
         </div>
      </div>
   );
};

export default observer(ProfileBar);
