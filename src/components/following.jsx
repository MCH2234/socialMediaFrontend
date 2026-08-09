import { useOutletContext } from "react-router";
import { useState, useEffect, useRef } from "react";
import FollowingPost from "./post/postfollow";
import { Navigate } from "react-router";
import style from "./home/home.module.css";
const Following = () => {
  const { fetchURL, JWT, user } = useOutletContext();
  const [cursor, setCursor] = useState();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState();
  // const [followRequests, setFollowRequests] = useState([]);

  const ref = useRef(null);

  const deletePost = (index) => {
    const filterPosts = posts.filter((post) => post !== posts[index]);
    setPosts(filterPosts);
  };

  const nextPage = async () => {
    try {
      const response = await fetch(`${fetchURL}/post/follow?cursor=${cursor}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: "GET",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        const copyPosts = [...posts];
        body.posts.forEach((post) => copyPosts.push(post));
        setPosts(copyPosts);
        if (body.cursor !== null) {
          if (body.cursor === cursor) {
            setCursor(null);
          } else if (body.cursor !== cursor) {
            setCursor(body.cursor);
          }
        } else {
          setCursor(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          nextPage();
        }
      });
    },
    { threshold: 0.5 },
  );
  useEffect(() => {
    if (!ref.current) return;
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [cursor, loading]);

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    if (JWT) {
      let ok;
      fetch(`${fetchURL}/post/follow`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: "get",
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
              setPosts(r.posts);
              setLoading(false);
              if (r.cursor !== null) {
                setCursor(r.cursor);
              }
            }
          }
        })
        .catch((error) => console.log(error));
    }
    return () => {
      controller.abort();
      ignore = true;
    };
  }, []);
  if (!JWT) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {!loading ? (
        <main>
          <section className={`flex col ${style.posts}`}>
            {posts.length >= 1 ? (
              <>
                {posts.map((post, index) => (
                  <FollowingPost
                    key={post.id}
                    post={post}
                    isUserPost={post.user.id === user.id}
                    removePost={() => deletePost(index)}
                  />
                ))}
                {cursor ? <p ref={ref}>loading...</p> : null}
              </>
            ) : (
              <p>There aren't any posts</p>
            )}
          </section>
        </main>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Following;
