import { Helmet } from "react-helmet";
import UserSettingMyPage from "../../components/UserSettingMyPage/UserSettingMyPage";
import st from "./user-settings.module.scss";

const UserSettings = () => {
  return (
    <div className={st.settings}>
      <Helmet title='Настройки | Yo' />
      <UserSettingMyPage />
    </div>
  );
};

export default UserSettings;
