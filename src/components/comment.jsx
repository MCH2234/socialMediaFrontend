import style from "./comment.module.css";
import Like from "../assets/like.svg";
import FullLike from "../assets/likefull.svg";
import { format } from "date-fns";
import { useState } from "react";
import { useOutletContext } from "react-router";
import AddReply from "./addreply";
import Replies from "./replies";
const Comment = ({ comment }) => {
  const initials =
    comment.user.first[0].toUpperCase() + comment.user.last[0].toUpperCase();
  const [like, setLike] = useState(comment.isLikedByUser);
  const [likeCount, setLikeCount] = useState(comment._count.likes);
  const [showReplies, setShowReplies] = useState(false);
  const [addReply, setAddReply] = useState({
    add: false,
    text: "",
  });
  const [replies, setReplies] = useState({
    shouldFetchReplies: true,
    replies: [],
  });
  const { fetchURL, JWT } = useOutletContext();

  const addReplyLocally = (value) => {
    let newRepliesArr = [...replies.replies];
    if (newRepliesArr.length >= 1) {
      newRepliesArr.unshift(value);
    } else {
      newRepliesArr.push(value);
    }
    setAddReply({ text: "", add: false });
    setReplies({
      shouldFetchReplies: comment.reply_count >= 1 ? true : false,
      replies: newRepliesArr,
    });
    setShowReplies(true);
  };

  const fetchReplies = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${fetchURL}/comment/replies/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          method: "GET",
        },
      );
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        setReplies({
          shouldFetchReplies: false,
          replies: body.replies.childComments,
        });
        setShowReplies(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeLikeStatus = async () => {
    let initalLikeCount = likeCount;
    let currentLikeState = like;
    try {
      setLikeCount(like ? like - 1 : like + 1);
      setLike(!currentLikeState);
      const response = await fetch(`${fetchURL}/comment/like/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: like ? "delete" : "post",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      }
    } catch (err) {
      setLikeCount(initalLikeCount);
      setLike(currentLikeState);
      console.log(err);
    }
  };
  return (
    <div className={`flex col`}>
      <div className={`flex row ${style.comment}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
        <div className={`${style.mainTextContainer}`}>
          <div className={`flex row ${style.userDate}`}>
            <div className={`flex col`}>
              <p className={`${style.name} no-margin`}>
                {comment.user.first} {comment.user.last}
              </p>
            </div>
            <p className={`${style.date}`}>
              {format(comment.date, "dd/MM HH:mmbb")}
            </p>
          </div>
          <p className={`${style.mainText}`}>{comment.text}</p>
          <div className={`flex row ${style.likes}`}>
            <img
              onClick={changeLikeStatus}
              className={`${style.like}`}
              src={like ? FullLike : Like}
              width="20px"
              height="20px"
            />
            <p className={`${style.likesCount}`}>{likeCount} Likes</p>
            <p
              onClick={() => setAddReply({ ...addReply, add: !addReply.add })}
              className={`${style.replyButton}`}
            >
              Reply
            </p>
            {comment.reply_count >= 1 || replies.replies.length >= 1 ? (
              <div className={`flex row ${style.showRepliesContainer}`}>
                {replies.shouldFetchReplies ? (
                  <p onClick={fetchReplies} className={`${style.fetchReplies}`}>
                    See{" "}
                    {replies.shouldFetchReplies && replies.replies.length >= 1
                      ? "more "
                      : null}{" "}
                    {comment.reply_count}{" "}
                    {comment.reply_count === 1 ? "reply" : "replies"}
                  </p>
                ) : (
                  <p
                    className={`${style.showReplies}`}
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {replies.length !== 0
                      ? showReplies
                        ? "Hide replies"
                        : "Show replies"
                      : null}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {showReplies ? <Replies replies={replies.replies} /> : null}
      {addReply.add ? (
        <AddReply
          reply={addReply}
          setAddReply={setAddReply}
          addReplyLocally={addReplyLocally}
          user={comment.user.user}
          initials={initials}
          commentId={comment.id}
        />
      ) : null}
    </div>
  );
};
export default Comment;
