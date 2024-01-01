import { Fragment, createElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import st from "./sidebar.module.scss";
import { observer } from "mobx-react-lite";
import { IPath } from "../../interfaces/SideBarPaths";
import { IoSettingsOutline } from "react-icons/io5";
import { pathsIcons } from "../../constants/sidebarPaths";
import user from "../../store/user";
import SidebarOptions from "../SidebarOptions/SidebarOptions";
import { useSidebarPaths } from "../../hooks/useSidebarPaths";

const Sidebar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const path = useNavigate();
  const [paths, setPaths] = useState<IPath[]>([]);
  useSidebarPaths(paths, setPaths);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setHeaderVisible(currentScrollPos < prevScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <nav
        className={[st.sidebar, headerVisible ? "" : st.sidebar__scrolled].join(
          " ",
        )}
      >
        {paths.map((opt) => (
          <Fragment key={opt.title}>
            {opt.included ? (
              <div className={st.option}>
                <div
                  onClick={() => setIsClicked(true)}
                  className={st.option__setting}
                >
                  <IoSettingsOutline style={{ fontSize: "18px" }} />
                </div>
                <div
                  className={st.option__button}
                  onClick={() => {
                    let com = opt.path
                      .split("/")
                      .map((p) => (p === "userId" ? user.user._id : p))
                      .join("/");
                    return path(com);
                  }}
                >
                  <div className={st.icon}>
                    {createElement(pathsIcons[opt.icon])}
                  </div>
                  <div>{opt.title}</div>
                </div>
              </div>
            ) : (
              ""
            )}
          </Fragment>
        ))}
      </nav>
      <SidebarOptions
        paths={paths}
        setPaths={setPaths}
        isClicked={isClicked}
        setIsClicked={setIsClicked}
      />
    </>
  );
};

export default observer(Sidebar);
