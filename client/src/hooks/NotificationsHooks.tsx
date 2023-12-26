import { useMutation } from "@tanstack/react-query";
import UserActionsService from "../service/user-actions.service";
import { Dispatch, SetStateAction, useEffect } from "react";
import { INotification } from "../interfaces/notification.interface";
import socket from "../store/socket";
import NotificationToast from "../components/UI/NotificationToast/NotificationToast";
import toast from "react-hot-toast";

export function useMakeNotificationViewed() {
  return useMutation(
    (id: string) => UserActionsService.makeNotificationViewed(id),
    {
      onSuccess: () => {
        console.log("success");
      },
      onError: () => {
        console.log("error");
      },
    },
  );
}

export function useNotification(
  setNotifications: Dispatch<SetStateAction<INotification[]>>,
) {
  const handleNewNotification = (notification: INotification) => {
    console.log(notification);
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
