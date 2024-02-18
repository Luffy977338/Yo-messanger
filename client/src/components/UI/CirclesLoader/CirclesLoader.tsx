import st from "./circles-loader.module.scss";

const CirclesLoader = () => {
  return (
    <div className={st.loader}>
      <div className={st.circle}>
        <div className={st.dot}></div>
        <div className={st.outline}></div>
      </div>
      <div className={st.circle}>
        <div className={st.dot}></div>
        <div className={st.outline}></div>
      </div>
      <div className={st.circle}>
        <div className={st.dot}></div>
        <div className={st.outline}></div>
      </div>
      <div className={st.circle}>
        <div className={st.dot}></div>
        <div className={st.outline}></div>
      </div>
    </div>
  );
};

export default CirclesLoader;
