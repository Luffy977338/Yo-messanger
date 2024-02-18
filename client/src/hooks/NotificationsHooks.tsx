import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  ICommentNotificationAction,
  IFriendRequestNotificationAction,
  ILikeNotificationAction,
  INotification,
  notificationTypes,
} from "../interfaces/notification.interface";
import socket from "../store/socket";
import NotificationToast from "../components/UI/NotificationToast/NotificationToast";
import toast from "react-hot-toast";
import NotificationService from "../service/notification.service";
import user from "../store/user";

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

type NotificationActionsMap = {
  like: ILikeNotificationAction;
  comment: ICommentNotificationAction;
  friendReq: IFriendRequestNotificationAction;
};

export function useCreateNewNotification() {
  return function <T extends notificationTypes>(
    type: T,
    options: NotificationActionsMap[T],
  ) {
    if (socket.socket) {
      socket.socket.emit(type, options);
    }
  };
}
