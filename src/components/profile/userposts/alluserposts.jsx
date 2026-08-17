import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import UserPost from "./postsprofile";
import style from "../profile.module.css";
import AddPost from "../../post/addpost";
import Errors from "../../errors";

const PostsOfUser = () => {
  const { JWT, fetchURL, user, posts, setPosts } = useOutletContext();
  const [errors, setErrors] = useState();

  const deletePostLocally = (index) => {
    let filterPosts = posts.posts.filter((post) => post !== posts.posts[index]);
    setPosts({ ...posts, posts: filterPosts });
  };

  const addPostsLocally = (newPost) => {
    setPosts({ ...posts, posts: [newPost, ...posts.posts] });
  };

  useEffect(() => {
    let ok;
    let ignore = false;
    const controller = new AbortController();
    if (user) {
      fetch(`${fetchURL}/post`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: "GET",
      })
        .then((r) => {
          ok = r.ok;
          return r.json();
        })
        .then((r) => {
          if (!ok) {
            throw new Error(r.error);
          } else {
            if (!ignore) {
              setPosts({ posts: r.posts, cursor: r.cursor });
            }
          }
        })
        .catch((err) => console.log(err));
    }
    return () => {
      controller.abort();
      ignore = true;
    };
  }, []);

  return (
    <section className={`flex col ${style.mainContainer}`}>
      {posts.posts.length >= 1 ? (
        posts.posts.map((post, index) => (
          <UserPost
            key={post.id}
            post={post}
            isUserPost={true}
            removePost={() => deletePostLocally(index)}
          />
        ))
      ) : (
        <div className={`flex col ${style.addNewPost}`}>
          <span>You don't have any posts. Make your first one!</span>

          <AddPost
            posts={posts.posts}
            setPosts={addPostsLocally}
            setErrors={setErrors}
          >
            {errors ? (
              <ul className={`flex col ${style.errors}`}>
                {errors.map((error, index) => (
                  <Errors key={index} msg={error} />
                ))}
              </ul>
            ) : null}
          </AddPost>
        </div>
      )}
    </section>
  );
};
export default PostsOfUser;
