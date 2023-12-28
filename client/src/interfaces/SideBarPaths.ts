type TIcon = "profile" | "posts" | "messages" | "friends";

export interface IPath {
  path: string;
  icon: TIcon;
  title: string;
  included: boolean;
  required: boolean;
}
