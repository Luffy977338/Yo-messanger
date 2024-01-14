import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { INotification } from "../interfaces/notification.interface";
import socket from "../store/socket";
import NotificationToast from "../components/UI/NotificationToast/NotificationToast";
import toast from "react-hot-toast";
import NotificationService from "../service/notification.service";
import user from "../store/user";
import { TNotificationTypes } from "../interfaces/notification-types.interface";

export function useGetNotifications() {
  return useQuery(
    ["notifications", user.user._id],
    NotificationService.getNotifications,
    { select: ({ data }) => data },
  );
}

export function useMakeNotificationViewed() {
  return useMutation(NotificationService.makeNotificationViewed);
}

export function useNewNotifications(
  setNotifications: Dispatch<SetStateAction<INotification[]>>,
) {
  const handleNewNotification = (notification: INotification) => {
    setNotifications((prev) => [notification, ...prev]);
    toast((t) => <NotificationToast t={t} notification={notification} />);
  };

  useEffect(() => {
    if (socket.socket) {
      socket.socket.on("newNotification", handleNewNotification);
    }

    return () => {
      if (socket.socket) {
        socket.socket.off("newNotification", handleNewNotification);
      }
    };
  }, [socket.socket]);
}

export function useCreateNewNotification() {
  return function (type: TNotificationTypes, options: unknown) {
    if (socket.socket) {
      socket.socket.emit(type, options);
    }
  };
}
