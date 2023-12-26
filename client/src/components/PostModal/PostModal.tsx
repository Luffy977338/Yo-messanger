import { Dispatch, SetStateAction } from "react";
import Modal from "../UI/Modal/Modal";
import { IPost } from "./../../interfaces/post.interface";
import Post from "../UI/Post/Post";

const PostModal = ({
  isClicked,
  setIsClicked,
  post,
}: {
  isClicked: boolean;
  setIsClicked: Dispatch<SetStateAction<boolean>>;
  post: IPost;
}) => {
  return (
    <Modal visible={isClicked} setVisible={setIsClicked}>
      <Post post={post} userCreator={post.userCreator} />
      {/* Change to custom component, special for postmodal */}
    </Modal>
  );
};

export default PostModal;
