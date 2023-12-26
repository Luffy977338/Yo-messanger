import React from "react";
import st from "./Modal.module.scss";

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ children, visible, setVisible }: ModalProps) => {
  const visibleClass = [st.myModal];

  if (visible === true) {
    visibleClass.push(st.active);
  }

  return (
    <div
      className={visibleClass.join(" ")}
      onClick={() => {
        setVisible(false);
        console.log("false");
      }}
    >
      <div className={st.myModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
