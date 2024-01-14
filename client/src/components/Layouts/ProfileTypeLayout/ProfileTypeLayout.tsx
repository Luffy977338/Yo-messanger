import { ReactNode } from "react";
import { IUser } from "../../../interfaces/user.interface";
import user from "../../../store/user";

const ProfileTypeLayout = ({
  creator,
  children,
}: {
  creator: IUser;
  children: ReactNode;
}) => {
  const isFriends = !!creator.friends.filter((el) => el._id === user.user._id)
    .length;

  if (
    creator.settings.myPage.profileType !== "open" &&
    creator._id !== user.user._id &&
    !isFriends
  ) {
    return (
      <div>
        <div>у {creator.username} закрыт профиль</div>
      </div>
    );
  }
  return children;
};

export default ProfileTypeLayout;
