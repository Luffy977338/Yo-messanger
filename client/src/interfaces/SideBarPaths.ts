type TIcon = "profile" | "posts" | "messages" | "friends" | "notifications";

export interface IPath {
  path: string;
  icon: TIcon;
  title: string;
  included: boolean;
  required: boolean;
}
