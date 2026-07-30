import { useState } from "react";
import Comment from "./comment";
import style from "./comment.module.css";
import { useOutletContext } from "react-router";

const Comments = ({ comments, setComments, postId }) => {
  const [cursor, setCursor] = useState(
    comments.length >= 1 ? comments[comments.length - 1].id : null,
  );
  const { fetchURL, JWT } = useOutletContext();

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${fetchURL}/post/${postId}/comments?cursor=${cursor}`,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          method: "GET",
        },
      );
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        if (cursor !== null) {
          const mergeComments = comments.concat(body.comments);
          setComments(mergeComments);
        }
        setCursor(body.cursor);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        <Comment key={index} comment={comment} />
      ))}
    </section>
  );
};

export default Comments;
