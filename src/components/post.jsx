import style from "./post.module.css";
import Like from "../assets/like.svg";
import LikeRed from "../assets/likefull.svg";
import { format } from "date-fns";
import { useOutletContext } from "react-router";
import { useRef, useState } from "react";
const Post = ({
  id,
  user,
  date,
  likes,
  text,
  isLikedByUser,
  isUserPost,
  // comments,
}) => {
  const { JWT, fetchURL } = useOutletContext();
  const [like, setLike] = useState(isLikedByUser);
  const [totalLikes, setLikes] = useState(likes);
  const [pending, setPending] = useState(false);
  const [edit, setEdit] = useState(false);
  const [postInfo, setPostInfo] = useState({
    date: date,
    text: text,
  });

  const postToBeDeleted = useRef(null);

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${fetchURL}/post/${id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: "DELETE",
      });
      const body = await response.json();
      if (!response.ok) {
        console.log("here");
        throw new Error(body.error);
      } else {
        postToBeDeleted.current.remove();
        console.log(body);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editPost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${fetchURL}/post/${id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ edit: postInfo.text }),
      });
      const body = await response.json();
      if (!response.ok) {
        setPostInfo({ date: date, text: text });
        setEdit(false);
        throw new Error(body.error);
      } else {
        console.log(body);
        setPostInfo({ ...postInfo, date: new Date() });
        setEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    <div ref={postToBeDeleted} className={`flex col ${style.post}`}>
      <div className={`flex row ${style.dateUser}`}>
        <p>@{user}</p>
        {!edit ? (
          <p className={`${style.date}`}>
            {format(postInfo.date, "do LLL HH:mmbb")}
          </p>
        ) : null}
        {isUserPost & !edit ? (
          <div className={`flex col ${style.buttonDiv}`}>
            <button
              onClick={() => setEdit(true)}
              className={`${style.edit} ${style.button}`}
            >
              Edit
            </button>
            <button
              onClick={deletePost}
              className={`${style.delete} ${style.button}`}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
      {!edit ? (
        <p>{postInfo.text}</p>
      ) : (
        <form className={`flex col ${style.editForm}`}>
          <textarea
            value={postInfo.text}
            name={"edit"}
            onChange={(e) => setPostInfo({ ...postInfo, text: e.target.value })}
          ></textarea>
          <div className={`flex row ${style.editBtn}`}>
            <button onClick={editPost}>Edit</button>
            <button
              onClick={() => {
                setEdit(false);
                setPostInfo({ ...postInfo, text: text });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
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
