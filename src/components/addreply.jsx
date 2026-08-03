import { useOutletContext } from "react-router";
import style from "./reply.module.css";
import { useEffect, useRef } from "react";
const AddReply = ({
  reply,
  replies,
  setAddReply,
  setReplies,
  user,
  initials,
  commentId,
}) => {
  const replyField = useRef(null);
  const { JWT, fetchURL } = useOutletContext();

  useEffect(() => {
    replyField.current.focus();
  }, []);

  const addReplyLocally = (value) => {
    let newRepliesArr = [...replies.replies];
    if (newRepliesArr.length >= 1) {
      newRepliesArr.unshift(value);
    } else {
      newRepliesArr.push(value);
    }
    setAddReply({ text: "", add: false });
    setReplies({ ...replies, replies: newRepliesArr });
  };

  const replyToComment = async (e) => {
    e.preventDefault();
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
      <form className={`flex row ${style.addReply}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
        <input
          ref={replyField}
          value={reply.text}
          onChange={(e) => setAddReply({ ...reply, text: e.target.value })}
          type="text"
          name="reply"
          placeholder={`Reply to ${user}...`}
          autoComplete="off"
        />
        {reply.text !== "" ? (
          <button onClick={replyToComment} className={`${style.addCommentBtn}`}>
            Reply
          </button>
        ) : null}
      </form>
    </>
  );
};
export default AddReply;
