import style from "./post.module.css";
import MainPost from "./postsubs/mainpost";
import AddComment from "../comments/addcomment";
import Comments from "../comments/comments";
import { useOutletContext } from "react-router";
import { useState } from "react";
const FollowingPost = ({ post, isUserPost, removePost }) => {
  const { JWT, fetchURL } = useOutletContext();
  const [comments, setComments] = useState(post.comments);
  const [commentToFocus, setCommentToFocus] = useState();

  const setInitialCursor =
    comments.length >= 3 ? comments[comments.length - 1].id : null;
  const [commentCursor, setCommentCursor] = useState(setInitialCursor);

  let initials =
    post.user.first[0].toUpperCase() + post.user.last[0].toUpperCase();

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${fetchURL}/post/${post.id}/comments?cursor=${commentCursor}`,
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
        const mergeComments = comments.concat(body.comments);
        setComments(mergeComments);
        setCommentCursor(body.cursor);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommentLocally = (index) => {
    let filterComments = comments.filter(
      (comment) => comment !== comments[index],
    );
    setComments(filterComments);
  };

  return (
    <div className={`flex col ${style.post}`}>
      <MainPost
        post={post}
        isUserPost={isUserPost}
        removePost={removePost}
        children={null}
      />
      <Comments
        comments={comments}
        fetchComments={fetchComments}
        removeComment={deleteCommentLocally}
        cursor={commentCursor}
        focus={commentToFocus}
      />
      <AddComment
        setComments={setComments}
        comments={comments}
        initials={initials}
        postId={post.id}
        setCommentToFocus={setCommentToFocus}
      />
    </div>
  );
};
export default FollowingPost;
