import {
  Navigate,
  Outlet,
  useHref,
  useNavigate,
  useOutletContext,
} from "react-router";
import { useEffect, useRef, useState } from "react";
import style from "./profile.module.css";
const CurrentUserProfile = () => {
  const { JWT, fetchURL, user } = useOutletContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const initials = user.first[0].toUpperCase() + user.last[0].toUpperCase();
  const [lineVisibility, setLineVisibility] = useState({
    visible: true,
    currentFocus: "",
  });
  const [follow, setFollow] = useState({
    following: { cursor: null, following: undefined },
    followers: { cursor: null, followers: undefined },
  });
  const [posts, setPosts] = useState({ posts: [], cursor: null });

  const line = useRef(null);
  const URLParams = useHref();

  const initialLineStyle = (current) => {
    switch (current) {
      default:
        return style.showOnPosts;
      case "posts":
        return style.showOnPosts;

      case "followers":
        return style.showOnFollowers;

      case "following":
        return style.showOnFollowing;
    }
  };

  useEffect(() => {
    const splitParams = URLParams.split("/")[2];
    console.log(splitParams);
    line.current.className = `${style.line} ${initialLineStyle(splitParams)}`;
    setLineVisibility({
      visible: true,
      currentFocus: splitParams !== undefined ? splitParams : "posts",
    });
  }, []);

  const navigate = useNavigate();

  const lineAnimationHandler = (current) => {
    if (lineVisibility.visible === false) {
      setLineVisibility({ visible: true, currentFocus: current });
    } else if (lineVisibility.visible) {
      if (lineVisibility.currentFocus === "") {
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        line.current.className = `${style.line} ${initialLineStyle(current)}`;
        if (current !== "posts") {
          navigate(`${current}`);
        } else {
          navigate("/profile");
        }
      }
      if (
        lineVisibility.currentFocus === "following" &&
        current === "followers"
      ) {
        line.current.className = `${style.line} ${style.moveToFollowersFromFollowing}`;
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        navigate("followers");
      } else if (
        lineVisibility.currentFocus === "followers" &&
        current === "following"
      ) {
        line.current.className = `${style.line} ${style.moveToFollowingFromFollowers}`;
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        navigate("following");
      } else if (
        lineVisibility.currentFocus === "followers" &&
        current === "posts"
      ) {
        line.current.className = `${style.line} ${style.moveToPostFromFollowers}`;
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        navigate("/profile");
      } else if (
        lineVisibility.currentFocus === "following" &&
        current === "posts"
      ) {
        line.current.className = `${style.line} ${style.moveToPostFromFollowing}`;
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        navigate("/profile");
      } else if (
        lineVisibility.currentFocus === "posts" &&
        current === "following"
      ) {
        line.current.className = `${style.line} ${style.moveToFollowingFromPost}`;
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        navigate("following");
      } else if (
        lineVisibility.currentFocus === "posts" &&
        current === "followers"
      ) {
        line.current.className = `${style.line} ${style.moveToFollowersFromPost}`;
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        navigate("followers");
      }
    }
  };

  return (
    <main>
      <header className={`flex row ${style.header}`}>
        <div className={`${style.pfp}`}>
          <p>
            <strong>{initials}</strong>
          </p>
        </div>
        <div className={`flex col ${style.nameAndStats}`}>
          <span id={`${style.name}`}>
            {user.first} {user.last}
          </span>
          <span id={`${style.user}`}>@{user.user}</span>
          <div className={`${style.stats}`}>
            <button onClick={() => lineAnimationHandler("posts")}>Posts</button>
            <button onClick={() => lineAnimationHandler("followers")}>
              Followers
            </button>
            <button onClick={() => lineAnimationHandler("following")}>
              Following
            </button>
            {lineVisibility.visible ? (
              <span
                ref={line}
                className={`${style.line} ${style.lineInitial}`}
              ></span>
            ) : null}
          </div>
        </div>
      </header>
      <Outlet
        context={{ user, follow, setFollow, JWT, fetchURL, posts, setPosts }}
      />
    </main>
  );
};
export default CurrentUserProfile;
