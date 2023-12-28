import { Fragment, createElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import st from "./sidebar.module.scss";
import { observer } from "mobx-react-lite";
import { IPath } from "../../interfaces/SideBarPaths";
import { IoSettingsOutline } from "react-icons/io5";
import Modal from "../UI/Modal/Modal";
import { defaultPaths, pathsIcons } from "../../constants/sidebarPaths";

const Sidebar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const path = useNavigate();
  const [paths, setPaths] = useState<IPath[]>([]);

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

  useEffect(() => {
    if (paths.length) {
      localStorage.setItem("sidebarPaths", JSON.stringify(paths));
    }
  }, [paths]);

  useEffect(() => {
    const storedPaths = localStorage.getItem("sidebarPaths");
    if (storedPaths) {
      setPaths(JSON.parse(storedPaths));
    } else {
      setPaths(defaultPaths);
    }
  }, []);

  const handleCheckboxChange = (index: number) => {
    setPaths((prevPaths) => {
      const newPaths = [...prevPaths];

      if (newPaths[index].required) {
        return newPaths;
      }

      newPaths[index] = {
        ...newPaths[index],
        included: !newPaths[index].included,
      };
      return newPaths;
    });
  };

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
                  onClick={() => path(opt.path)}
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
      <Modal visible={isClicked} setVisible={setIsClicked}>
        <div>
          {paths.map((opt, index) => (
            <div key={opt.title}>
              {opt.required ? (
                <input
                  type='checkbox'
                  checked={opt.included}
                  disabled
                  onChange={() => handleCheckboxChange(index)}
                />
              ) : (
                <input
                  type='checkbox'
                  defaultChecked={opt.included}
                  onChange={() => handleCheckboxChange(index)}
                />
              )}
              <div key={opt.title} className={st.option}>
                <div className={st.option__button}>
                  <div className={st.icon}>
                    {createElement(pathsIcons[opt.icon])}
                  </div>
                  <div>{opt.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default observer(Sidebar);
