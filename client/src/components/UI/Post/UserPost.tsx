import user from "../../../store/user";
import { IPost } from "../../../interfaces/post.interface";
import { observer } from "mobx-react-lite";
import { IUser } from "../../../interfaces/user.interface";
import Post from "./Post";

const UserPost = ({ userCreator }: { userCreator: IUser }) => {
   const canDelete = userCreator._id === user.user._id;

   return (
      <>
         {userCreator.posts?.length > 0 ? (
            <>
               {userCreator.posts.map((post: IPost) => (
                  <Post
                     key={post._id}
                     post={post}
                     userCreator={userCreator}
                     canDelete={canDelete}
                  />
               ))}
            </>
         ) : (
            <div>
               {userCreator._id === user.user._id
                  ? "У вас нет постов"
                  : `У ${userCreator.username} Нет постов`}
            </div>
         )}
      </>
   );
};

export default observer(UserPost);
