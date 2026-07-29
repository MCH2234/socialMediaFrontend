import style from "./post.module.css";
import Like from "../assets/like.svg";
import LikeRed from "../assets/likefull.svg";
import { format } from "date-fns";
import { useOutletContext } from "react-router";
import { useRef, useState } from "react";
import Comments from "./comments";
import AddComment from "./addcomment";
const Post = ({
  post,
  isUserPost,
  // comments,
}) => {
  const { JWT, fetchURL } = useOutletContext();
  const [like, setLike] = useState(post.isLikedByUser);
  const [totalLikes, setLikes] = useState(post._count.likes);
  const [pending, setPending] = useState(false);
  const [edit, setEdit] = useState(false);
  const [postInfo, setPostInfo] = useState({
    date: post.date,
    text: post.text,
  });
  let initials =
    post.user.first[0].toUpperCase() + post.user.last[0].toUpperCase();

  const postToBeDeleted = useRef(null);

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${fetchURL}/post/${post.id}`, {
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
      const response = await fetch(`${fetchURL}/post/${post.id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ edit: postInfo.text }),
      });
      const body = await response.json();
      if (!response.ok) {
        setPostInfo({ date: post.date, text: post.text });
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
        await fetch(`${fetchURL}/post/like/${post.id}`, {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          method: "POST",
        });
      } else {
        await fetch(`${fetchURL}/post/like/${post.id}`, {
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
      {/* <span className={`${style.experiment}`}></span> */}
      <div className={`flex row ${style.dateUser}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
        <div className={`flex col ${style.pfpNames}`}>
          <p className="no-margin">
            {post.user.first} {post.user.last}
          </p>
          <p className="no-margin">@{post.user.user}</p>
        </div>
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
        <p className={`${style.postText}`}>{postInfo.text}</p>
      ) : (
        <form className={`flex col ${style.editForm}`}>
          <textarea
            placeholder="Edit your comment"
            value={postInfo.text}
            name={"edit"}
            onChange={(e) => setPostInfo({ ...postInfo, text: e.target.value })}
          ></textarea>
          <div className={`flex row ${style.editBtn}`}>
            <button onClick={editPost}>Edit</button>
            <button
              onClick={() => {
                setEdit(false);
                setPostInfo({ ...postInfo, text: post.text });
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
      <Comments comments={post.comments} />
      <AddComment initials={initials} postId={post.id} />
    </div>
  );
};

export default Post;
