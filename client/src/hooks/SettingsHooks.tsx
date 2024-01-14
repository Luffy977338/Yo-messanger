import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingsService from "../service/settings.service";
import user from "../store/user";

export function useGetSettingsByUserId(userId: string | undefined) {
  return useQuery(
    ["settings", user.user._id],
    () => SettingsService.getSettingsByUserId(userId),
    { select: ({ data }) => data },
  );
}

export function useChangeProfileType() {
  const queryClient = useQueryClient();
  return useMutation(SettingsService.changeProfileType, {
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
    },
  });
}
