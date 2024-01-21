import { GoDotFill } from "react-icons/go";
import st from "./post-slider.module.scss";
import { MdArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { useState } from "react";

const PostSlider = ({ pictures }: { pictures: string[] | [] }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const goToPrevSlide = () => {
    setCurrentSlide(
      currentSlide - 1 < 0 ? pictures.length - 1 : currentSlide - 1,
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide(currentSlide + 1 >= pictures.length ? 0 : currentSlide + 1);
  };

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
              <button type='button'>
                {pictures[currentSlide] && (
                  <img
                    draggable={false}
                    src={`${import.meta.env.VITE_REACT_APP_API_URL}/${
                      pictures[currentSlide]
                    }`}
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

export default PostSlider;
