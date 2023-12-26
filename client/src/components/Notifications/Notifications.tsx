import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import PopUpAnimation from "../../animations/PopUp.animation";
import { INotification } from "../../interfaces/notification.interface";
import st from "./notifications.module.scss";
import Notification from "../UI/Notification/Notification";
import { IoNotificationsOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import $api from "../../http";
import user from "../../store/user";
import {
  useMakeNotificationViewed,
  useNotification,
} from "../../hooks/NotificationsHooks";
import { useClickAway } from "../../hooks/useClickAway";

const Notifications = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const notificationsButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationsBarRef = useRef<HTMLDivElement | null>(null);

  const {} = useQuery(
    [user.user._id],
    () => {
      return $api.get(`/${user.user._id}`);
    },
    {
      select: (data) => data.data,
      onSuccess: (data) => {
        setNotifications((prev) => [...data?.notifications, ...prev]);
      },
    },
  );

  const makeNotificationViewed = useMakeNotificationViewed();

  const handleOpen = async () => {
    setIsClicked((prev) => !prev);
    setNotifications((prev) =>
      prev.map((n) =>
        n.isViewed === false ? { ...n, isViewed: true } : { ...n },
      ),
    );
    notifications.forEach(async (not) => {
      if (not.isViewed === false) {
        await makeNotificationViewed.mutateAsync(not._id);
      }
    });
  };

  useNotification(setNotifications);
  useClickAway(setIsClicked, [notificationsButtonRef, notificationsBarRef]);

  return (
    <div>
      <button
        ref={notificationsButtonRef}
        className={st.notificationButton}
        onClick={() => handleOpen()}
      >
        {notifications.filter((not) => not.isViewed === false).length ? (
          <span className={st.notificationsCounter}>
            {notifications.filter((not) => not.isViewed === false).length}
          </span>
        ) : (
          ""
        )}
        <IoNotificationsOutline />
      </button>
      <AnimatePresence mode='wait'>
        {isClicked ? (
          <motion.div
            ref={notificationsBarRef}
            variants={PopUpAnimation}
            initial='from'
            animate='to'
            exit='from'
            transition={{ duration: 0.1 }}
            className={st.notifications}
          >
            {notifications.length ? (
              <>
                {notifications.map((n, index) =>
                  index <= 10 ? (
                    <Notification
                      key={index}
                      setIsOpen={setIsClicked}
                      notification={n}
                    />
                  ) : (
                    ""
                  ),
                )}
                {notifications.length > 10 ? (
                  <button className={st.notifications__button}>
                    Показать все уведомления
                  </button>
                ) : (
                  ""
                )}
              </>
            ) : (
              "Нет уведомлений"
            )}
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
