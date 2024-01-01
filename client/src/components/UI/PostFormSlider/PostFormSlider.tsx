import { Dispatch, SetStateAction, useEffect, useState } from "react";
import st from "./post-form-slider.module.scss";
import { GoDotFill } from "react-icons/go";
import { MdOutlineArrowForwardIos, MdArrowBackIos } from "react-icons/md";

const PostFormSlider = ({
  pictures,
  setPictures,
}: {
  pictures: File[] | [];
  setPictures: Dispatch<SetStateAction<File[] | []>>;
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const goToPrevSlide = () => {
    setCurrentSlide(
      currentSlide - 1 < 0 ? pictures.length - 1 : currentSlide - 1,
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide(currentSlide + 1 >= pictures.length ? 0 : currentSlide + 1);
  };

  const removePicture = () => {
    setPictures((prev) => {
      const updatedPictures = prev.filter(
        (el, index) => index !== currentSlide,
      );
      return updatedPictures;
    });
  };

  useEffect(() => {
    setCurrentSlide((prev) => {
      return prev === 0 ? 0 : prev - 1;
    });
  }, [pictures]);

  return (
    <>
      {!!pictures.length ? (
        <>
          <div className={st.pictures}>
            {pictures.length !== 1 && (
              <button
                className={st.pictures__leftButton}
                type='button'
                onClick={() => goToPrevSlide()}
                disabled={pictures.length === 1}
              >
                <MdArrowBackIos />
              </button>
            )}
            <div className={st.pictures__picture}>
              <button type='button' onClick={() => removePicture()}>
                {pictures[currentSlide] && (
                  <img
                    draggable={false}
                    src={URL.createObjectURL(pictures[currentSlide])}
                    alt=''
                  />
                )}
              </button>
            </div>
            {pictures.length !== 1 && (
              <button
                className={st.pictures__rightButton}
                type='button'
                onClick={() => goToNextSlide()}
                disabled={pictures.length === 1}
              >
                <MdOutlineArrowForwardIos />
              </button>
            )}
          </div>
          <div className={st.dots}>
            {pictures.map((el, index) => (
              <div
                className={st.dot}
                onClick={() => setCurrentSlide(index)}
                key={index}
              >
                <GoDotFill
                  style={{
                    color: `${
                      index === currentSlide ? "var(--blue-icon)" : "#fff"
                    }`,
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default PostFormSlider;
