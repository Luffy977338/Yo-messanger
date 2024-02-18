import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createElement,
} from "react";
import { IPath } from "../../interfaces/SideBarPaths";
import { pathsIcons } from "../../constants/sidebarPaths";
import Modal from "../Modal/Modal";
import st from "./sidebar-options.module.scss";
import SidebarCheckbox from "../UI/SidebarCheckbox/SidebarCheckbox";

const SidebarOptions = ({
  paths,
  setPaths,
  isClicked,
  setIsClicked,
}: {
  paths: IPath[];
  setPaths: Dispatch<SetStateAction<IPath[]>>;
  isClicked: boolean;
  setIsClicked: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleCheckboxChange = (
    index: number,
    ref: MutableRefObject<HTMLInputElement | null>,
  ) => {
    setPaths((prevPaths) => {
      const newPaths = [...prevPaths];

      if (newPaths[index].required) {
        return newPaths;
      }

      if (ref?.current?.checked) {
        newPaths[index] = {
          ...newPaths[index],
          included: true,
        };
      } else {
        newPaths[index] = {
          ...newPaths[index],
          included: false,
        };
      }
      return newPaths;
    });
  };

  return (
    <Modal visible={isClicked} setVisible={setIsClicked}>
      <div>
        {paths.map((opt, index) => (
          <label
            className={st.path}
            key={opt.title}
            htmlFor={`sedebarOptionCheckbox-${index}`}
          >
            <div className={st.option}>
              <div className={st.option__button}>
                <div className={st.icon}>
                  {createElement(pathsIcons[opt.icon])}
                </div>
                <div>{opt.title}</div>
              </div>
            </div>
            <SidebarCheckbox
              opt={opt}
              handleCheckboxChange={handleCheckboxChange}
              index={index}
            />
          </label>
        ))}
      </div>
    </Modal>
  );
};

export default SidebarOptions;
