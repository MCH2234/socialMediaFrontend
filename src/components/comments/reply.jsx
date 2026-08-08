import style from "./reply.module.css";
import Like from "../../assets/like.svg";
import FullLike from "../../assets/likefull.svg";
import Options from "../../assets/more.svg";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
const Reply = ({ comment, index, isUserReply, setReplies }) => {
  const [like, setLike] = useState(comment.isLikedByUser);
  const [likeCount, setlikeCount] = useState(comment._count.likes);
  const [replyInfo, setReplyInfo] = useState({
    text: comment.text,
    date: comment.date,
  });
  const [showOptions, setShowOptions] = useState(false);
  const [edit, setEdit] = useState(false);
  const [originalReplyText, setOriginalReplyText] = useState(comment.text);

  const { JWT, fetchURL } = useOutletContext();

  const focusOnNewReply = useRef(null);
  const editReplyContent = useRef(null);
  const replyToBeDeleted = useRef(null);

  function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }

  const editReply = async (e) => {
    e.preventDefault();
    if (replyInfo.text === "") {
      if (editReplyContent.current.className === `${style.editTextArea}`) {
        editReplyContent.current.className = `${style.editTextArea} errorAnimation`;
      } else if (
        editReplyContent.current.className ===
        `${style.editTextArea} errorAnimation`
      ) {
        editReplyContent.current.className = `${style.editTextArea}`;
        editReplyContent.current.offsetWidth;
        editReplyContent.current.className = `${style.editTextArea} errorAnimation`;
      }
      return;
    }
    if (replyInfo.text === originalReplyText) {
      setEdit(false);
      return;
    }
    try {
      const response = await fetch(`${fetchURL}/comment/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          comment: replyInfo.text,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setEdit(false);
        setReplyInfo({ text: comment.text, date: comment.date });
        throw new Error(body.error);
      } else {
        setEdit(false);
        setReplyInfo({ ...replyInfo, date: new Date() });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteReply = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${fetchURL}/comment/${comment.id}`, {
        headers: { Authorization: `Bearer ${JWT}` },
        method: "DELETE",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        setReplies(index);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (index === 0) {
      if (!isElementInView(focusOnNewReply.current)) {
        focusOnNewReply.current.focus();
      }
    }
  }, [index]);

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
    <div
      onClick={() => {
        setShowOptions(false);
      }}
      ref={replyToBeDeleted}
      className={`flex row overflow ${style.reply}`}
    >
      <div className={`${style.pfp}`}>
        <p>{initials}</p>
      </div>
      <div
        tabIndex="0"
        ref={focusOnNewReply}
        className={`flex col ${style.mainTextContainer}`}
      >
        <div className={`flex row ${style.dateUser}`}>
          <p className={`${style.name} no-margin`}>
            {comment.user.first} {comment.user.last}
          </p>
          <div className={`flex row ${style.left}`}>
            {isUserReply && !edit ? (
              <div className={`${style.relative}`}>
                <img
                  src={Options}
                  width="15px"
                  height="15px"
                  className={`${style.options}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(!showOptions);
                  }}
                  tabIndex={0}
                />
                {showOptions ? (
                  <div className={`flex col ${style.buttonDiv}`}>
                    <button
                      onClick={() => {
                        setEdit(true);
                        setShowOptions(false);
                        setOriginalReplyText(replyInfo.text);
                      }}
                      className={`${style.edit} ${style.button}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={deleteReply}
                      className={`${style.delete} ${style.button}`}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}{" "}
              </div>
            ) : null}
            <p className={`${style.date}`}>
              {format(comment.date, "dd/MM HH:mmbb")}
            </p>
          </div>
        </div>
        {!edit ? (
          <p className={`${style.mainText}`}>{replyInfo.text}</p>
        ) : (
          <form onSubmit={editReply} className={`flex col ${style.editForm}`}>
            <textarea
              placeholder="Edit your reply"
              value={replyInfo.text}
              name={"edit"}
              onChange={(e) => {
                if (
                  editReplyContent.current.className ===
                    `${style.editTextArea} errorAnimation` &&
                  replyInfo.text !== ""
                ) {
                  editReplyContent.current.className = `${style.editTextArea}`;
                }
                setReplyInfo({ ...replyInfo, text: e.target.value });
              }}
              className={`${style.editTextArea}`}
              ref={editReplyContent}
            ></textarea>
            <div className={`flex row ${style.editBtn}`}>
              <button type="submit">Edit</button>
              <button
                onClick={() => {
                  setEdit(false);
                  setReplyInfo({ ...comment, text: comment.text });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
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
