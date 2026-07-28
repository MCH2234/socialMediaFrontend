import AddComment from "./addcomment";
import Comment from "./comment";

const Comments = ({ comments, initials, postId }) => {
  return (
    <section>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
      <AddComment initials={initials} postId={postId} />
    </section>
  );
};

export default Comments;
