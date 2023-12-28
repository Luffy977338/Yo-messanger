import { BiUserCircle } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineNewspaper } from "react-icons/hi";
import { TbMessageCircle2 } from "react-icons/tb";
import user from "../store/user";
import { IPath } from "../interfaces/SideBarPaths";

export const pathsIcons = {
  profile: BiUserCircle,
  posts: HiOutlineNewspaper,
  messages: TbMessageCircle2,
  friends: FaUserFriends,
};

export const defaultPaths: IPath[] = [
  {
    path: `/${user.user._id}`,
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
    path: `/friends/${user.user._id}`,
    icon: "friends",
    title: "Друзья",
    included: true,
    required: false,
  },
];
