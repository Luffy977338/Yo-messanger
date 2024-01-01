import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { MPopUpAnimation } from "../../animations/PopUp.animation";
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
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useChangeLocation } from "../../hooks/useChangeLocation";

const Notifications = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const notificationsButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationsBarRef = useRef<HTMLDivElement | null>(null);
  const path = useNavigate();
  useChangeLocation(() => setIsClicked(false));

  const {} = useQuery(
    ["notifications", user.user._id],
    () => {
      return $api.get(`/${user.user._id}`);
    },
    {
      select: (data) => data.data,
      onSuccess: (data) => {
        setNotifications([...data?.notifications]);
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
            variants={MPopUpAnimation}
            initial='from'
            animate='to'
            exit='from'
            transition={{ duration: 0.1 }}
            className={st.notifications}
          >
            {notifications.length ? (
              <>
                {notifications.map((n, index) =>
                  index <= 7 ? (
                    <Notification key={index} notification={n} />
                  ) : (
                    ""
                  ),
                )}
                {notifications.length > 7 ? (
                  <button
                    onClick={() => {
                      setIsClicked(false);
                      path("/notifications");
                    }}
                    className={st.notifications__button}
                  >
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

export default observer(Notifications);
