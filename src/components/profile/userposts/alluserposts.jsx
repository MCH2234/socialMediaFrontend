import { useOutletContext } from "react-router";
import { useEffect } from "react";
import UserPost from "./postsprofile";
import style from "../profile.module.css";

const PostsOfUser = () => {
  const { JWT, fetchURL, user, posts, setPosts } = useOutletContext();

  const deletePostLocally = (index) => {
    let filterPosts = posts.posts.filter((post) => post !== posts.posts[index]);
    setPosts({ ...posts, posts: filterPosts });
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
              console.log(r.posts);
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
        <p>You don't have any posts</p>
      )}
    </section>
  );
};
export default PostsOfUser;
