import st from "./load-friend.module.scss";

const LoadFriend = () => {
  return (
    <div className={st.friend}>
      <img
        draggable={false}
        className={st.friend__avatar}
        src={`../../../public/assets/images/default-user-avatar.jpg`}
        alt=''
      />
      <p className={st.friend__username}></p>
    </div>
  );
};

export default LoadFriend;
