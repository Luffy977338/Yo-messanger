import React from "react";
import { observer } from "mobx-react-lite";
import { API_URL } from "../../http";
import user from "../../store/user";
import st from "./form.module.scss";
import { SlCamera } from "react-icons/sl";
import toast from "react-hot-toast";
import PostFormSlider from "../UI/PostFormSlider/PostFormSlider";
import { useCreatePost } from "../../hooks/PostHooks";

const Form = ({
  setQueryKey,
  isLoading,
}: {
  setQueryKey: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
}) => {
  const [content, setContent] = React.useState<string>("");
  const [pictures, setPictures] = React.useState<File[] | []>([]);
  const mutation = useCreatePost({ setContent, setPictures, setQueryKey });

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (pictures) {
      pictures.forEach((el, inx) => {
        formData.append(`picture-${inx}`, el);
      });
    }

    toast.promise(mutation.mutateAsync(formData), {
      loading: "Проверка поста",
      success: "Пост опубликован",
      error: (data) => `${data.response.data.message}` || "Что-то пошло не так",
    });
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPicture = event.target.files ? event.target.files[0] : null;
    setPictures((prev) => {
      if (selectedPicture) {
        return [...prev, selectedPicture];
      }
      return [...prev];
    });
  };

  return (
    <form className={st.postForm} onSubmit={handleForm}>
      <div className={st.postForm__data}>
        <div>
          <img
            draggable={false}
            className={st.postForm__data_avatar}
            src={`${API_URL}/${user.user.avatar}`}
            alt=''
          />
        </div>
        <div>
          <input
            placeholder='О чем хотите рассказать?...'
            className={st.postForm__data_input}
            type='text'
            value={content}
            disabled={mutation.isLoading || isLoading}
            maxLength={3000}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={st.postForm__tools}>
        <div>
          <input
            id='picture'
            name='picture'
            type='file'
            onChange={handlePictureChange}
          />
          <label className={st.label} title='Фотографии' htmlFor='picture'>
            <SlCamera style={{ fontSize: "20px" }} />
          </label>
        </div>
        <div>
          <button
            className={st.postForm__tools_button}
            type='submit'
            disabled={mutation.isLoading || isLoading}
          >
            {mutation.isLoading ? "Сохранение" : "Сохранить"}
          </button>
        </div>
      </div>
      <PostFormSlider pictures={pictures} setPictures={setPictures} />
    </form>
  );
};

export default observer(Form);
