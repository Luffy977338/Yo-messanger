import { useNavigate } from "react-router-dom";
import { notificationsMessages } from "../../../constants/notificationMessages";
import { API_URL } from "../../../http";
import { INotification } from "../../../interfaces/notification.interface";
import st from "./notification.module.scss";
import { useState } from "react";
import Post from "../../Post/Post";
import Modal from "../Modal/Modal";
import { useChangeLocation } from "../../../hooks/useChangeLocation";

const Notification = ({ notification }: { notification: INotification }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const type = notification.type;
  const path = useNavigate();
  useChangeLocation(() => setIsClicked(false));

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
              {notification.post.pictures && (
                <img
                  className={st.notification__post_picture}
                  width={150}
                  src={`${API_URL}/${notification.post.pictures[0]}`}
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
        <Modal setVisible={setIsClicked} visible={isClicked}>
          <Post
            post={notification.post}
            userCreator={notification.post.userCreator}
          />
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default Notification;
