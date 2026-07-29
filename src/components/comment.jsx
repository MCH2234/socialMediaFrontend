import style from "./comment.module.css";
const Comment = ({ comment }) => {
  const initials =
    comment.user.first[0].toUpperCase() + comment.user.last[0].toUpperCase();
  return (
    <div className={`flex row ${style.comment}`}>
      <div className={`${style.pfp}`}>
        <p>{initials}</p>
      </div>
      <div className={`${style.mainTextContainer}`}>
        <div className={`flex col ${style.pfpNames}`}>
          <p className="no-margin">
            {comment.user.first} {comment.user.last}
          </p>
        </div>
        <p className={`${style.mainText}`}>{comment.text}</p>
      </div>
    </div>
  );
};
export default Comment;
