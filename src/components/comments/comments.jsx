import { useOutletContext } from "react-router";
import Comment from "./comment";
import style from "./comment.module.css";

const Comments = ({
  comments,
  cursor,
  fetchComments,
  focus,
  removeComment,
}) => {
  const { user } = useOutletContext();
  return (
    <section
      style={comments.length >= 1 ? { marginTop: 20 } : null}
      className={`flex col ${style.commentSection}`}
    >
      {comments.length >= 3 && cursor !== null ? (
        <p onClick={fetchComments} className={`${style.replies}`}>
          See more replies
        </p>
      ) : null}
      {comments.map((comment, index) => (
        <Comment
          key={comment.id}
          comment={comment}
          isUserComment={user.id === comment.user.id}
          index={index}
          shouldFocus={focus === comment}
          removeComment={() => removeComment(index)}
        />
      ))}
    </section>
  );
};

export default Comments;
