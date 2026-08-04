import style from "./home.module.css";
const Errors = ({ msg }) => {
  return <li className={`${style.error}`}>{msg}</li>;
};
export default Errors;
