import { useQuery } from "@tanstack/react-query";
import user from "../../store/user";
import $api from "../../http";
import Loader from "../../components/UI/Loader/Loader";
import { INotification } from "../../interfaces/notification.interface";
import Notification from "../../components/UI/Notification/Notification";
import st from "./all-notifications.module.scss";
import { observer } from "mobx-react-lite";

const AllNotifications = () => {
  const { isLoading, data } = useQuery(
    ["notifications", user.user._id],
    () => {
      return $api.get(`/${user.user._id}`);
    },
    { select: (data) => data.data },
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : data ? (
        <>
          {!!data.notifications.length && (
            <div className={st.notifications}>
              {data.notifications.map((notif: INotification, index: number) => (
                <Notification key={index} notification={notif} />
              ))}
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
