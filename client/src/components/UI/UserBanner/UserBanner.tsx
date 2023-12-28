import st from "./user-banner.module.scss";
import { API_URL } from "../../../http";
import Friendship from "../../Friendship/Friendship";
import user from "../../../store/user";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate } from "react-router-dom";
import { IUser } from "../../../interfaces/user.interface";
import React from "react";
import Modal from "../Modal/Modal";
import SendMessageByBanner from "../../SendMessageByBanner/SendMessageByBanner";

interface UserBannerProps {
  userCreator: IUser;
  isLoading: boolean;
}

const UserBanner = ({ userCreator, isLoading }: UserBannerProps) => {
  const [isClicked, setIsClicked] = React.useState(false);
  const path = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setIsClicked(false);
  }, [location.pathname]);
  return (
    <div className={st.banner}>
      <div className={st.banner__header}></div>
      <img
        draggable={false}
        className={st.banner__avatar}
        src={
          isLoading
            ? `${API_URL}/default-user-avatar.jpg`
            : `${API_URL}/${userCreator.avatar}`
        }
        alt=''
      />
      <div className={st.banner__info}>
        <div className={st.wrap__info}>
          {isLoading ? (
            <>
              <p className={st.fetchBanner__info_username}></p>
              <p className={st.fetchBanner__info_description}></p>
            </>
          ) : (
            <>
              <p className={st.banner__info_username}>{userCreator.username}</p>
              <p className={st.banner__info_description}>
                {userCreator.description}
              </p>
            </>
          )}
        </div>
        {isLoading ? (
          <div className={st.fetchEdit}></div>
        ) : (
          <>
            {user.user._id === userCreator._id ? (
              <div className={st.edit}>
                <button onClick={() => path(`/edit`)} className={st.edit__btn}>
                  Редактировать профиль
                </button>
              </div>
            ) : (
              <div className={st.options}>
                <div>
                  <button
                    onClick={() => setIsClicked((prev) => !prev)}
                    className={st.options__text}
                  >
                    Написать
                  </button>
                </div>
                <Friendship />
              </div>
            )}
          </>
        )}
      </div>
      {isClicked ? (
        <Modal setVisible={setIsClicked} visible={isClicked}>
          <SendMessageByBanner
            setIsClicked={setIsClicked}
            userCreator={userCreator}
          />
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default observer(UserBanner);
