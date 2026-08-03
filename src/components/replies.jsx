import Reply from "./reply";
import style from "./reply.module.css";

const Replies = ({ replies }) => {
  return (
    <section className={`flex col ${style.replies}`}>
      {replies.map((reply, index) => (
        <Reply key={reply.id} index={index} comment={reply} />
      ))}
    </section>
  );
};
export default Replies;
