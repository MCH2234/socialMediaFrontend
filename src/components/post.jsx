import style from "./post.module.css";
const Post = ({ user, date, likes, text, comments }) => {
  return (
    <div className={`flex col ${style.post}`}>
      <div className={`flex row`}>
        <p>@{user}</p>
        <p>{date}</p>
      </div>
      <p>{text}</p>
      <p>{likes} likes</p>
    </div>
  );
};

export default Post;
