import style from "./reply.module.css";
import Like from "../assets/like.svg";
import FullLike from "../assets/likefull.svg";
import { format } from "date-fns";
import { useState } from "react";
import { useOutletContext } from "react-router";
const Reply = ({ comment }) => {
  const [like, setLike] = useState(comment.isLikedByUser);
  const [likeCount, setlikeCount] = useState(comment._count.likes);
  const { JWT, fetchURL } = useOutletContext();

  const initials =
    comment.user.first[0].toUpperCase() + comment.user.last[0].toUpperCase();

  const changeLikeStatus = async (e) => {
    e.preventDefault();
    let initialLikes = likeCount;
    let initialLikeStatus = like;
    setLike(!initialLikeStatus);
    setlikeCount(initialLikeStatus ? likeCount - 1 : likeCount + 1);
    try {
      const response = await fetch(`${fetchURL}/comment/like/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: like ? "DELETE" : "POST",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      }
    } catch (err) {
      console.log(err);
      setLike(initialLikeStatus);
      setlikeCount(initialLikes);
    }
  };

  return (
    <div className={`flex row ${style.reply}`}>
      <div className={`${style.pfp}`}>
        <p>{initials}</p>
      </div>
      <div className={`flex col ${style.mainText}`}>
        <div className={`flex row ${style.dateUser}`}>
          <p className={`${style.name} no-margin`}>
            {comment.user.first} {comment.user.last}
          </p>
          <p className={`${style.date}`}>
            {format(comment.date, "dd/MM HH:mmbb")}
          </p>
        </div>
        <p className={`${style.text}`}>{comment.text}</p>
        <div className={`flex row ${style.likes}`}>
          <img
            className={`${style.like}`}
            src={like ? FullLike : Like}
            onClick={changeLikeStatus}
            width="15px"
            height="15px"
          />
          <p className={`no-margin`}>{likeCount} Likes</p>
        </div>
      </div>
    </div>
  );
};
export default Reply;
