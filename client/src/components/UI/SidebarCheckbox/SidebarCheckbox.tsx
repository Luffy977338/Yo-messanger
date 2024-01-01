import { MutableRefObject, useRef } from "react";
import { IPath } from "../../../interfaces/SideBarPaths";
import st from "./sidebar-checkbox.module.scss";

const SidebarCheckbox = ({
  opt,
  index,
  handleCheckboxChange,
}: {
  opt: IPath;
  index: number;
  handleCheckboxChange: (
    index: number,
    ref: MutableRefObject<HTMLInputElement | null>,
  ) => void;
}) => {
  const isRequired = opt.required;
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className={st.checkbox__wrapper}>
        <div className={st.cbx}>
          {isRequired ? (
            <input
              checked={opt.included}
              disabled
              type='checkbox'
              id={`sedebarOptionCheckbox-${index}`}
            />
          ) : (
            <input
              defaultChecked={opt.included}
              ref={inputRef}
              onChange={() => {
                handleCheckboxChange(index, inputRef);
              }}
              type='checkbox'
              id={`sedebarOptionCheckbox-${index}`}
            />
          )}
          <span className={isRequired ? st.disabledSpan : st.span}></span>
          <svg fill='none' viewBox='0 0 15 14' height='14' width='15'>
            <path d='M2 8.36364L6.23077 12L13 2'></path>
          </svg>
        </div>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <filter id='goo-12'>
              <feGaussianBlur
                result='blur'
                stdDeviation='4'
                in='SourceGraphic'
              ></feGaussianBlur>
              <feColorMatrix
                result='goo-12'
                values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7'
                mode='matrix'
                in='blur'
              ></feColorMatrix>
              <feBlend in2='goo-12' in='SourceGraphic'></feBlend>
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default SidebarCheckbox;
