import toast, { Toast } from "react-hot-toast";
import { INotification } from "../../../interfaces/notification.interface";
import { notificationsMessages } from "../../../constants/notificationMessages";
import st from "./notification-toast.module.scss";

const NotificationToast = ({
  t,
  notification,
}: {
  t: Toast;
  notification: INotification;
}) => {
  return (
    <>
      <div>
        <div className={st.top}>
          <div className={st.user}>
            <img
              className={st.user__avatar}
              width={50}
              height={50}
              src={
                notification.user.avatar ||
                `../../../public/assets/images/default-user-avatar.jpg`
              }
              alt='avatar'
            />
            <p className={st.user__username}>{notification.user.username}</p>
          </div>
          <div className={st.dismiss} onClick={() => toast.dismiss(t.id)}>
            &times;
          </div>
        </div>
        <p className={st.user__message}>
          {notificationsMessages[notification.type]}
        </p>
        <div className={st.post}>
          <p className={st.post__content}>{notification.post?.content}</p>
          {notification.post?.pictures.length ? (
            <img
              className={st.post__picture}
              width={100}
              src={`${import.meta.env.VITE_REACT_APP_API_URL}/${
                notification.post.pictures[0]
              }`}
              alt=''
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationToast;
