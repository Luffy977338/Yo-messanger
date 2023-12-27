import { useNavigate } from "react-router-dom";
import { notificationsMessages } from "../../../constants/notificationMessages";
import { API_URL } from "../../../http";
import { INotification } from "../../../interfaces/notification.interface";
import st from "./notification.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import PostModal from "../../PostModal/PostModal";

const Notification = ({
  notification,
  setIsOpen,
}: {
  notification: INotification;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const type = notification.type;
  const path = useNavigate();
  return (
    <>
      <div onClick={() => setIsClicked(true)} className={st.notification}>
        <div className={st.notification__user}>
          <div>
            <img
              className={st.notification__user_avatar}
              draggable={false}
              src={`${API_URL}/${notification.user.avatar}`}
              alt='avatar'
            />
          </div>
          <div className={st.notification__payload}>
            <span
              onClick={() => {
                path(`/${notification.user._id}`);
                setIsOpen(false);
              }}
              className={st.notification__user_username}
            >
              {notification.user.username}
            </span>{" "}
            <span className={st.notification__user_message}>
              {notificationsMessages[type]}
            </span>
          </div>
        </div>
        {notification.post ? (
          <div className={st.notification__post}>
            {notification.post.content && (
              <div className={st.notification__post_content}>
                {notification.post.content}
              </div>
            )}
            <div>
              {notification.post.picture && (
                <img
                  className={st.notification__post_picture}
                  width={150}
                  src={`${API_URL}/${notification.post.picture}`}
                  alt=''
                />
              )}
            </div>
          </div>
        ) : (
          "Запись удалена"
        )}
      </div>
      {notification.post && isClicked ? (
        <PostModal
          setIsClicked={setIsClicked}
          isClicked={isClicked}
          post={notification.post}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Notification;
