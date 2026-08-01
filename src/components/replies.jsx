import Reply from "./reply";
import style from "./reply.module.css";

const Replies = ({ replies }) => {
  return (
    <section className={`flex col ${style.replies}`}>
      {replies.map((reply) => (
        <Reply key={reply.id} comment={reply} />
      ))}
    </section>
  );
};
export default Replies;
