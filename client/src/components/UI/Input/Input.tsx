import { FC, InputHTMLAttributes, forwardRef } from "react";
import st from "./input.module.scss";
import { SlCamera } from "react-icons/sl";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  handlePictureChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = forwardRef(
  ({ handlePictureChange, ...options }) => {
    return (
      <div className={st.input}>
        <input {...options} className={st.input__message} />
        <input
          className={st.input__picture}
          name='picture'
          type='file'
          onChange={handlePictureChange}
        />
        <label className={st.label} title='Фотографии' htmlFor='picture'>
          <SlCamera style={{ fontSize: "20px" }} />
        </label>
      </div>
    );
  },
);

export default Input;
