import { useOutletContext } from "react-router";
import style from "./reply.module.css";
import { useEffect, useRef } from "react";
const AddReply = ({
  reply,
  setAddReply,
  addReplyLocally,
  user,
  initials,
  commentId,
}) => {
  const replyField = useRef(null);
  const { JWT, fetchURL } = useOutletContext();

  useEffect(() => {
    replyField.current.focus();
  }, []);

  const replyToComment = async (e) => {
    e.preventDefault();
    if (reply.text === "") {
      if (replyField.current.className === `${style.addReplyInput}`) {
        replyField.current.className = `${style.addReplyInput} ${style.errorAnimation}`;
      } else if (
        replyField.current.className ===
        `${style.addReplyInput} ${style.errorAnimation}`
      ) {
        replyField.current.className = `${style.addReplyInput}`;
        replyField.current.offsetWidth;
        replyField.current.className = `${style.addReplyInput} ${style.errorAnimation}`;
      }
      return;
    }
    try {
      const response = await fetch(`${fetchURL}/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ comment: reply.text }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        addReplyLocally(body.reply);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={replyToComment} className={`flex row ${style.addReply}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
        <input
          ref={replyField}
          value={reply.text}
          onChange={(e) => {
            if (
              reply.text !== "" &&
              replyField.current.className ===
                `${style.addReplyInput} ${style.errorAnimation}`
            ) {
              replyField.current.className = `${style.addReplyInput}`;
            }
            setAddReply({ ...reply, text: e.target.value });
          }}
          className={`${style.addReplyInput}`}
          type="text"
          name="reply"
          placeholder={`Reply to ${user}...`}
          autoComplete="off"
        />
        {reply.text !== "" ? (
          <button className={`${style.addCommentBtn}`}>Reply</button>
        ) : null}
      </form>
    </>
  );
};
export default AddReply;
