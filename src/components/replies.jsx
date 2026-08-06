import { useOutletContext } from "react-router";
import Reply from "./reply";
import style from "./reply.module.css";

const Replies = ({ replies }) => {
  const { user } = useOutletContext();
  return (
    <section className={`flex col ${style.replies}`}>
      {replies.map((reply, index) => (
        <Reply
          key={reply.id}
          index={index}
          isUserReply={reply.user.id === user.id}
          comment={reply}
        />
      ))}
    </section>
  );
};
export default Replies;
