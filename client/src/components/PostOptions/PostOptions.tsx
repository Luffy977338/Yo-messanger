import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import st from "./post-options.module.scss";
import { useQuery } from "@tanstack/react-query";
import { IoTrashOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import Modal from "../UI/Modal/Modal";
import Loader from "../UI/Loader/Loader";
import { IUser } from "../../interfaces/user.interface";
import $api from "../../http";
import LikeUser from "../UI/LikeUser/LikeUser";
import toast from "react-hot-toast";
import { useDeletePost } from "../../hooks/PostHooks";
import { MMenuPopUpAnimation } from "../../animations/PopUp.animation";

const PostOptions = ({
  id,
  picture,
  canDelete,
  beforeDelete,
}: {
  id: string;
  picture?: string;
  canDelete: boolean;
  beforeDelete?: Function;
}) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [isHover, setIsHover] = React.useState<boolean>(false);
  const deleteMutation = useDeletePost(beforeDelete);

  const { isFetching, data } = useQuery(
    ["post", id],
    () => $api.get(`/posts/${id}`),
    {
      select: (data) => data.data,
    },
  );

  return (
    <div>
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        style={{
          cursor: "pointer",
          fontSize: 28,
          color: "var(--second-dark)",
        }}
      >
        <FiMoreHorizontal />
      </div>
      <AnimatePresence mode='wait'>
        {isHover ? (
          <motion.div
            initial='from'
            animate='to'
            exit='from'
            variants={MMenuPopUpAnimation}
            className={st.mutations}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div
              onClick={() => {
                data.likes?.length
                  ? setVisible(true)
                  : toast.error("На этом посте еще нет лайков", {
                      style: { background: "#444", color: "#eee" },
                    });
                setIsHover(false);
              }}
              className={st.mutations__getLikesList}
              style={{
                borderRadius: `${canDelete ? "15px 15px 0 0" : "15px"}`,
              }}
            >
              <p className={st.mutations__likes}>
                <FaHeart />
              </p>
              <button>Лайки</button>
            </div>
            {canDelete ? (
              <div
                onClick={() => {
                  setIsHover(false);
                  deleteMutation.isLoading
                    ? null
                    : deleteMutation.mutateAsync({
                        id: id,
                        fileName: picture ? picture : "",
                      });
                }}
                className={st.mutations__delete}
                style={{ borderRadius: "0 0 15px 15px" }}
              >
                <p className={st.mutations__trash}>
                  <IoTrashOutline />
                </p>
                <button>Удалить пост</button>
              </div>
            ) : (
              ""
            )}
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
      <Modal visible={visible} setVisible={setVisible}>
        <div>
          {isFetching ? (
            <Loader />
          ) : data && data.likes?.length ? (
            <div className={st.likeUser__wrap}>
              {data.likes.map((user: IUser) => (
                <div key={user._id} onClick={() => setVisible(false)}>
                  <LikeUser
                    id={user._id}
                    avatar={user.avatar}
                    username={user.username}
                  />
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PostOptions;
