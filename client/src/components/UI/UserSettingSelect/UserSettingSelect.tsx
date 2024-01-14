import { useState, useRef, ReactNode, Children, isValidElement } from "react";
import st from "./user-setting-select.module.scss";
import { useClickAway } from "../../../hooks/useClickAway";
import { AnimatePresence, motion } from "framer-motion";
import { MPopUpAnimation } from "../../../animations/PopUp.animation";
import { userSettingsWords } from "./../../../constants/userSettingsWords";
import { UserSettingsKey } from "../../../interfaces/settings.interface";

interface UserSettingSelectProps {
  children: ReactNode[];
  userSettings: UserSettingsKey;
}

const UserSettingSelect = ({
  children,
  userSettings,
}: UserSettingSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userSettingsWords[userSettings] || getDefaultSelectedOption(children),
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useClickAway(setIsOpen, [dropdownRef, selectRef]);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: ReactNode) => {
    setSelectedOption(() => {
      if (isValidElement(option)) {
        return String(option.props.children);
      }
      return "Выбрать...";
    });

    setIsOpen(false);
  };

  function getDefaultSelectedOption(children: ReactNode[]): string | null {
    const firstChild = children[0];
    if (isValidElement(firstChild)) {
      return String(firstChild.props.children);
    }
    return null;
  }

  return (
    <div className={st.userSettingSelect} ref={dropdownRef}>
      <div
        className={st.selectedOption}
        ref={selectRef}
        onClick={toggleDropdown}
      >
        {selectedOption || "Выбрать..."}
      </div>
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            variants={MPopUpAnimation}
            initial='from'
            animate='to'
            exit='from'
            transition={{ duration: 0.12 }}
            className={st.options}
          >
            {Children.map(children, (option, index) => (
              <div
                key={index}
                className={`${st.option} ${
                  selectedOption === getDefaultSelectedOption([option]) ||
                  selectedOption === option
                    ? st.selected
                    : ""
                }`}
                onClick={() => handleOptionClick(option as string)}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSettingSelect;
