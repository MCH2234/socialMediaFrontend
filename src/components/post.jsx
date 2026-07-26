import style from "./post.module.css";
import Like from "../assets/like.svg";
import LikeRed from "../assets/likefull.svg";
import { format } from "date-fns";
import { useOutletContext } from "react-router";
import { useState } from "react";
const Post = ({ id, user, date, likes, text, isLikedByUser, comments }) => {
  const { JWT, fetchURL } = useOutletContext();
  const [like, setLike] = useState(isLikedByUser);
  const [totalLikes, setLikes] = useState(likes);
  const [pending, setPending] = useState(false);
  const likePost = async () => {
    if (pending) {
      return;
    }
    setPending(true);
    const changedLike = !like;
    setLike(changedLike);
    let initial = totalLikes;
    setLikes(() => (changedLike ? totalLikes + 1 : totalLikes - 1));
    try {
      if (!like) {
        await fetch(`${fetchURL}/post/like/${id}`, {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          method: "POST",
        });
      } else {
        await fetch(`${fetchURL}/post/like/${id}`, {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          method: "DELETE",
        });
      }
    } catch {
      setLike(!changedLike);
      setLikes(initial);
    } finally {
      setPending(false);
    }
  };
  return (
    <div className={`flex col ${style.post}`}>
      <div className={`flex row ${style.dateUser}`}>
        <p>@{user}</p>
        <p className={`${style.date}`}>{format(date, "do LLL HH:mmbb")}</p>
      </div>
      <p>{text}</p>
      <div className={`flex row ${style.likes}`}>
        <img
          onClick={likePost}
          id={style.like}
          src={like ? LikeRed : Like}
          alt="like icon"
          width="20px"
          height="20px"
        />
        <p>{totalLikes} likes</p>
      </div>
    </div>
  );
};

export default Post;
