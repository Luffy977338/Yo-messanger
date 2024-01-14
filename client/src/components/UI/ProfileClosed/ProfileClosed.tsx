import { MdOutlineLock } from "react-icons/md";
import st from "./profile-closed.module.scss";

const ProfileClosed = ({ username }: { username: string | undefined }) => {
  return (
    <div className={st.closed}>
      <div className={st.closed__lock}>
        <MdOutlineLock />
      </div>
      <div className={st.closed__message}>
        {username
          ? `У ${username} закрыт профиль, добавьте его в друзья чтобы видеть записи`
          : "Профиль закрыт, добавьте пользователдя в друзья чтобы видеть его записи"}
      </div>
    </div>
  );
};

export default ProfileClosed;
