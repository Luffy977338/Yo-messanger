import { QueryKey, useQuery } from "@tanstack/react-query";
import UserService from "../service/user.service";

export function useUser({
  queryKey,
  userId,
}: {
  queryKey?: QueryKey;
  userId: string;
}) {
  const key = queryKey ? [queryKey.join(","), userId] : [userId];
  return useQuery(key, () => UserService.getUser(userId), {
    select: ({ data }) => data,
  });
}
