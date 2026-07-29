import Comment from "./comment";
import style from "./comment.module.css";

const Comments = ({ comments }) => {
  return (
    <section className={`flex col ${style.commentSection}`}>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </section>
  );
};

export default Comments;
