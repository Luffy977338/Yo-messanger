import Loader from "../../components/UI/Loader/Loader";
import { INotification } from "../../interfaces/notification.interface";
import Notification from "../../components/Notification/Notification";
import st from "./all-notifications.module.scss";
import { observer } from "mobx-react-lite";
import { useGetNotifications } from "../../hooks/NotificationsHooks";
import { Helmet } from "react-helmet";

const AllNotifications = () => {
  const { isLoading, data } = useGetNotifications();

  return (
    <>
      <Helmet title='Уведомления | Yo' />
      {isLoading ? (
        <Loader />
      ) : data ? (
        <>
          {data.length ? (
            <div className={st.notifications}>
              {data.map((notif: INotification, index: number) => (
                <Notification key={index} notif={notif} />
              ))}
            </div>
          ) : (
            <div className={st.notifications}>
              <div style={{ margin: 20 }}>Нет никаких уведомлений</div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default observer(AllNotifications);
