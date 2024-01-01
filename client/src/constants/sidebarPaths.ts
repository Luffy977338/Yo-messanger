import { BiUserCircle } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineNewspaper } from "react-icons/hi";
import { TbMessageCircle2 } from "react-icons/tb";
import { IPath } from "../interfaces/SideBarPaths";
import { IoNotificationsOutline } from "react-icons/io5";

export const pathsIcons = {
  profile: BiUserCircle,
  posts: HiOutlineNewspaper,
  messages: TbMessageCircle2,
  friends: FaUserFriends,
  notifications: IoNotificationsOutline,
};

export const defaultPaths: IPath[] = [
  {
    path: `/userId`,
    icon: "profile",
    title: "Мой профиль",
    included: true,
    required: true,
  },
  {
    path: `/posts`,
    icon: "posts",
    title: "Новости",
    included: true,
    required: true,
  },
  {
    path: `/messages`,
    icon: "messages",
    title: "Сообщения",
    included: true,
    required: true,
  },
  {
    path: `/friends/userId`,
    icon: "friends",
    title: "Друзья",
    included: true,
    required: false,
  },
  {
    path: `/notifications`,
    icon: "notifications",
    title: "Уведомления",
    included: true,
    required: false,
  },
];
