import { useRef, useState } from "react";
import { useOutletContext } from "react-router";
import style from "./comment.module.css";

const AddComment = ({
  initials,
  setComments,
  comments,
  postId,
  setCommentToFocus,
}) => {
  const [input, setInput] = useState("");
  const { fetchURL, JWT } = useOutletContext();
  const commentInput = useRef(null);
  const postComment = async (e) => {
    e.preventDefault();
    if (input === "") {
      if (commentInput.current.className === `${style.addCommentInput}`) {
        commentInput.current.className = `${style.addCommentInput} ${style.errorAnimation}`;
      } else if (
        commentInput.current.className ===
        `${style.addCommentInput} ${style.errorAnimation}`
      ) {
        commentInput.current.className = `${style.addCommentInput}`;
        commentInput.current.offsetWidth;
        commentInput.current.className = `${style.addCommentInput} ${style.errorAnimation}`;
      }
      return;
    }
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
        setCommentToFocus(body.comment);

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
      <form onSubmit={postComment} className={`${style.addComment}`}>
        <input
          type="text"
          name="comment"
          placeholder="Add a comment..."
          className={`${style.addCommentInput}`}
          value={input}
          autoComplete="off"
          ref={commentInput}
          onChange={(e) => {
            if (
              e.target.value !== "" &&
              commentInput.current.className ===
                `${style.addCommentInput} ${style.errorAnimation}`
            ) {
              commentInput.current.className = `${style.addCommentInput}`;
            }
            setInput(e.target.value);
          }}
        />
        {input !== "" ? (
          <button className={`${style.addCommentBtn}`}>Post</button>
        ) : null}
      </form>
    </div>
  );
};

export default AddComment;
