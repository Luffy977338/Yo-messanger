import React, { CSSProperties, useEffect } from "react";
import st from "./Modal.module.scss";

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: CSSProperties;
}

const Modal = ({ children, visible, setVisible, style }: ModalProps) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [visible]);

  const visibleClass = [st.myModal];

  if (visible === true) {
    visibleClass.push(st.active);
  }

  return (
    <div
      className={visibleClass.join(" ")}
      onClick={() => {
        setVisible(false);
      }}
    >
      <div
        style={style}
        className={st.myModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
