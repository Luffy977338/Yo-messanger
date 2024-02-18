import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "../service/user-friendship.service";
import { useCreateNewNotification } from "./NotificationsHooks";

export function useSubscribe(id: string) {
  const queryClient = useQueryClient();
  const createNotification = useCreateNewNotification();
  return useMutation(() => UserService.subscribe(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(["friends"]);
      console.log(data);
      createNotification("friendReq", {
        toUserId: id,
        userId: data.subscriber._id,
      });
    },
  });
}

export function useUnsubscribe(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.unsubscribe(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useAcceptFriend(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.confirmFriend(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useRejectFriend(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.rejectFriend(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useDeleteFriend(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.deleteFriend(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}
