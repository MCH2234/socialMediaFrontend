import style from "./comment.module.css";
import Like from "../../assets/like.svg";
import FullLike from "../../assets/likefull.svg";
import Options from "../../assets/more.svg";
import AddReply from "./addreply";
import Replies from "./replies";
import { format } from "date-fns";
import { useRef, useState, useEffect } from "react";
import { useOutletContext } from "react-router";
const Comment = ({ comment, isUserComment, shouldFocus, removeComment }) => {
  const [commentInfo, setCommentInfo] = useState({
    date: comment.date,
    text: comment.text,
  });

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
  const [edit, setEdit] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [originalComment, setOriginalComment] = useState(comment.text);

  const initials =
    comment.user.first[0].toUpperCase() + comment.user.last[0].toUpperCase();

  const { fetchURL, JWT } = useOutletContext();

  const editCommentContent = useRef(null);
  const commentToBeDeleted = useRef(null);
  const commentToFocus = useRef(null);

  function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }
  useEffect(() => {
    if (shouldFocus) {
      if (!isElementInView(commentToFocus.current)) {
        commentToFocus.current.focus();
      }
    }
  }, [shouldFocus]);

  const deleteComment = async (e) => {
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
        removeComment();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editComment = async (e) => {
    e.preventDefault();
    if (commentInfo.text === "") {
      if (editCommentContent.current.className === `${style.editTextArea}`) {
        editCommentContent.current.className = `${style.editTextArea} errorAnimation`;
      } else if (
        editCommentContent.current.className ===
        `${style.editTextArea} errorAnimation`
      ) {
        editCommentContent.current.className = `${style.editTextArea}`;
        editCommentContent.current.offsetWidth;
        editCommentContent.current.className = `${style.editTextArea} errorAnimation`;
      }
      return;
    }
    if (commentInfo.text === originalComment) {
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
          comment: commentInfo.text,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setEdit(false);
        setCommentInfo({ text: comment.text, date: comment.date });
        throw new Error(body.error);
      } else {
        setEdit(false);
        setCommentInfo({ ...commentInfo, date: new Date() });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addReplyLocally = (value) => {
    let newRepliesArr = [...replies.replies];
    if (newRepliesArr.length >= 1) {
      newRepliesArr.unshift(value);
    } else {
      newRepliesArr.push(value);
    }
    setAddReply({ text: "", add: false });
    setReplies({
      shouldFetchReplies:
        replies.shouldFetchReplies === false
          ? false
          : comment.reply_count >= 1
            ? true
            : false,
      replies: newRepliesArr,
    });
    setShowReplies(true);
  };

  const deleteReplyLocally = (index) => {
    const filterReplies = replies.replies.filter(
      (reply) => reply !== replies.replies[index],
    );
    setReplies({ ...replies, replies: filterReplies });
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
    <div
      ref={commentToBeDeleted}
      onClick={() => {
        setShowOptions(false);
      }}
      className={`flex col `}
    >
      <div className={`flex row ${style.comment}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
        <div
          ref={commentToFocus}
          tabindex={0}
          className={`${style.mainTextContainer}`}
        >
          <div className={`flex row ${style.userDate}`}>
            <div className={`flex col overflow`}>
              <p className={`${style.name} no-margin`}>
                {comment.user.first} {comment.user.last}
              </p>
            </div>
            <div className={`flex row ${style.left}`}>
              {isUserComment && !edit ? (
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
                          setOriginalComment(commentInfo.text);
                        }}
                        className={`${style.edit} ${style.button}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={deleteComment}
                        className={`${style.delete} ${style.button}`}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}{" "}
                </div>
              ) : null}
              <p className={`${style.date}`}>
                {format(commentInfo.date, "dd/MM HH:mmbb")}
              </p>
            </div>
          </div>
          {!edit ? (
            <p className={`${style.mainText}`}>{commentInfo.text}</p>
          ) : (
            <form
              onSubmit={editComment}
              className={`flex col ${style.editForm}`}
            >
              <textarea
                placeholder="Edit your comment"
                value={commentInfo.text}
                name={"edit"}
                onChange={(e) => {
                  if (
                    editCommentContent.current.className ===
                      `${style.editTextArea} errorAnimation` &&
                    commentInfo.text !== ""
                  ) {
                    editCommentContent.current.className = `${style.editTextArea}`;
                  }
                  setCommentInfo({ ...commentInfo, text: e.target.value });
                }}
                className={`${style.editTextArea}`}
                ref={editCommentContent}
              ></textarea>
              <div className={`flex row ${style.editBtn}`}>
                <button type="submit">Edit</button>
                <button
                  onClick={() => {
                    setEdit(false);
                    setCommentInfo({ ...comment, text: comment.text });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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
              tabIndex={0}
            >
              Reply
            </p>
            {(comment.reply_count >= 1 &&
              replies.shouldFetchReplies === true) ||
            replies.replies.length >= 1 ? (
              <div className={`flex row ${style.showRepliesContainer}`}>
                {replies.shouldFetchReplies ? (
                  <p onClick={fetchReplies} className={`${style.fetchReplies}`}>
                    See {comment.reply_count}{" "}
                    {replies.shouldFetchReplies && replies.replies.length >= 1
                      ? "more "
                      : null}{" "}
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
      {showReplies ? (
        <Replies replies={replies.replies} setReplies={deleteReplyLocally} />
      ) : null}
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
