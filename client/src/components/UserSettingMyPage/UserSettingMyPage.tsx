import {
  useChangeProfileType,
  useGetSettingsByUserId,
} from "../../hooks/SettingsHooks";
import {
  ISettings,
  StringToUserSettingsKey,
} from "../../interfaces/settings.interface";
import user from "../../store/user";
import Loader from "../UI/Loader/Loader";
import UserSettingBlock from "../UI/UserSettingBlock/UserSettingBlock";
import UserSettingSelect from "../UI/UserSettingSelect/UserSettingSelect";
import st from "./user-setting-my-page.module.scss";

const UserSettingMyPage = () => {
  const { data, isLoading } = useGetSettingsByUserId(user.user._id);
  const changeProfileType = useChangeProfileType();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : data ? (
        <UserSettingBlock title='Моя страница'>
          <div className={st.option}>
            <div>Тип профиля</div>
            <UserSettingSelect
              userSettings={
                data.myPage.profileType as StringToUserSettingsKey<
                  ISettings["myPage"]["profileType"]
                >
              }
            >
              <button
                className={st.option__button}
                disabled={changeProfileType.isLoading}
                onClick={() => changeProfileType.mutateAsync("open")}
              >
                Открытый
              </button>
              <button
                className={st.option__button}
                disabled={changeProfileType.isLoading}
                onClick={() => changeProfileType.mutateAsync("close")}
              >
                Закрытый
              </button>
            </UserSettingSelect>
          </div>
          <div className={st.option}>
            <div>Кто может меня комментировать</div>
            <UserSettingSelect
              userSettings={
                data.myPage.whoCanComment as StringToUserSettingsKey<
                  ISettings["myPage"]["whoCanComment"]
                >
              }
            >
              <div>
                <button className={st.option__button}>Все пользователи</button>
              </div>
              <div>
                <button className={st.option__button}>Только друзья</button>
              </div>
              <div>
                <button className={st.option__button}>Только я</button>
              </div>
            </UserSettingSelect>
          </div>
        </UserSettingBlock>
      ) : (
        ""
      )}
    </>
  );
};

export default UserSettingMyPage;
