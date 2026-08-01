import { useOutletContext } from "react-router";
import style from "./comment.module.css";
const AddReply = ({ reply, setReply, user, commentId }) => {
  const { JWT, fetchURL } = useOutletContext();

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
        setReply({ text: "", add: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form className={`${style.addReply}`}>
        <input
          value={reply.text}
          onChange={(e) => setReply({ ...reply, text: e.target.value })}
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
