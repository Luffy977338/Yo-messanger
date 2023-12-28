import st from "./header.module.scss";
import { useNavigate } from "react-router-dom";
import Notifications from "./../Notifications/Notifications";
import { observer } from "mobx-react-lite";
import ProfileBar from "../ProfileBar/ProfileBar";

const Header = () => {
  const path = useNavigate();

  return (
    <header className={st.header__wrap}>
      <div className={st.header}>
        <div className={st.header__left}>
          <div className={st.logo} onClick={() => path("/posts")}>
            <span>Y</span>
            <span>O</span>
            <span>!</span>
          </div>
          <Notifications />
        </div>
        <ProfileBar />
      </div>
    </header>
  );
};

export default observer(Header);
