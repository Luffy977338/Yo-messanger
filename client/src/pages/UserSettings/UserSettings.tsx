import UserSettingMyPage from "../../components/UserSettingMyPage/UserSettingMyPage";
import st from "./user-settings.module.scss";

const UserSettings = () => {
  return (
    <div className={st.settings}>
      <UserSettingMyPage />
    </div>
  );
};

export default UserSettings;
