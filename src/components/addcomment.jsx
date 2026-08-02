import { useRef, useState } from "react";
import style from "./comment.module.css";
import { useOutletContext } from "react-router";

const AddComment = ({ initials, setComments, comments, postId }) => {
  const [input, setInput] = useState("");
  const { fetchURL, JWT } = useOutletContext();
  const commentInput = useRef(null);
  const postComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${fetchURL}/post/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          comment: input,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        let copyComments = [...comments];
        copyComments.unshift(body.comment);
        setComments(copyComments);

        setInput("");
        commentInput.current.blur();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`flex row ${style.container}`}>
      <div className={`${style.pfp}`}>
        <p>{initials}</p>
      </div>
      <form className={`${style.addComment}`}>
        <input
          type="text"
          name="comment"
          placeholder="Add a comment..."
          value={input}
          autoComplete="off"
          ref={commentInput}
          onChange={(e) => setInput(e.target.value)}
        />
        {input !== "" ? (
          <button onClick={postComment} className={`${style.addCommentBtn}`}>
            Post
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default AddComment;
