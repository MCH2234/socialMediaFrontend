import { useOutletContext } from "react-router";
import style from "./reply.module.css";
const AddReply = ({ reply, setReply, user, initials, commentId }) => {
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
      <form className={`flex row ${style.addReply}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
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
