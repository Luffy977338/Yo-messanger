import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import user from "../../store/user";
import st from "./form.module.scss";
import { SlCamera } from "react-icons/sl";
import toast from "react-hot-toast";
import PostFormSlider from "../UI/PostFormSlider/PostFormSlider";
import { useCreatePost } from "../../hooks/PostHooks";
import { validImageTypes } from "../../constants/validImageTypes";

const Form = ({
  setQueryKey,
  isLoading,
}: {
  setQueryKey: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
}) => {
  const [content, setContent] = React.useState<string>("");
  const [pictures, setPictures] = React.useState<File[] | []>([]);
  const createPost = useCreatePost({ setContent, setPictures, setQueryKey });

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPicture = event.target.files ? event.target.files[0] : null;

    if (selectedPicture) {
      if (validImageTypes.includes(selectedPicture.type)) {
        return setPictures((prev) => [...prev, selectedPicture]);
      }
      console.error("Invalid file type. Please choose a valid image.");
    }
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content && !pictures.length) return;

    const formData = new FormData();
    formData.append("content", content);
    if (pictures) {
      pictures.forEach((el, inx) => {
        formData.append(`picture-${inx}`, el);
      });
    }

    await createPost.mutateAsync(formData);
  };

  useEffect(() => {
    let toastId;
    if (createPost.isLoading) {
      toastId = toast.loading("Выгружаем...");
    }

    if (!createPost.isLoading) {
      toast.dismiss(toastId);
    }

    if (createPost.isSuccess) {
      toast.success("Пост опубликован");
    }
  }, [createPost.isLoading]);

  return (
    <form className={st.postForm} onSubmit={handleForm}>
      <div className={st.postForm__data}>
        <div>
          <img
            draggable={false}
            className={st.postForm__data_avatar}
            src={
              user.user.avatar ||
              `../../../public/assets/images/default-user-avatar.jpg`
            }
            alt=''
          />
        </div>
        <div>
          <input
            placeholder='О чем хотите рассказать?...'
            className={st.postForm__data_input}
            type='text'
            value={content}
            disabled={createPost.isLoading || isLoading}
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
            disabled={createPost.isLoading || isLoading}
          >
            {createPost.isLoading ? "Сохранение" : "Сохранить"}
          </button>
        </div>
      </div>
      <PostFormSlider pictures={pictures} setPictures={setPictures} />
    </form>
  );
};

export default observer(Form);
