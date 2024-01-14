import { ReactNode } from "react";
import st from "./user-setting-block.module.scss";

const UserSettingBlock = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className={st.settingBlock}>
      <div className={st.settingBlock__title}>{title}</div>
      <div className={st.settingBlock__children}>{children}</div>
    </div>
  );
};

export default UserSettingBlock;
