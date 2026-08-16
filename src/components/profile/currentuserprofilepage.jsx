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
  const [currentTab, setCurrentTab] = useState(0);

  const navigate = useNavigate();

  const line = useRef(null);
  const containerRef = useRef(null);
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

  const alternativeLineAnimationHandler = (index) => {
    if (index === currentTab) return;
    const elementToMoveTo =
      containerRef.current.children[index].getBoundingClientRect();
    const currentElement =
      containerRef.current.children[currentTab].getBoundingClientRect();
    line.current.style.width = `${(elementToMoveTo.width * 80) / 100}px`;
    let left = 0;
    if (index > 0) {
      for (let i = 0; i < index; i++) {
        left += containerRef.current.children[i].getBoundingClientRect().width;
      }
    }
    left =
      left +
      (containerRef.current.children[index].getBoundingClientRect().width *
        10) /
        100;
    line.current.style.left = `${left}px`;
    const diff = index > currentTab ? index - currentTab : currentTab - index;
    const currentElementWidth = currentElement.width;
    const elementToMoveToWidth = elementToMoveTo.width;
    let howMuchToMove = 0;
    if (diff === 1) {
      howMuchToMove =
        index < currentTab
          ? (currentElementWidth * 10) / 100 +
            elementToMoveToWidth -
            (elementToMoveToWidth * 10) / 100
          : -currentElementWidth +
            (currentElementWidth * 10) / 100 -
            (elementToMoveToWidth * 10) / 100;
    } else if (diff > 1) {
      for (
        let j = currentTab;
        index > currentTab ? j < index : j > index;
        index > currentTab ? j++ : j--
      ) {
        howMuchToMove +=
          containerRef.current.children[j].getBoundingClientRect().width;
      }
      let finalHowMuchToMove =
        index < currentTab
          ? howMuchToMove -
            (currentElementWidth * 10) / 100 +
            (elementToMoveToWidth * 10) / 100
          : -howMuchToMove +
            (currentElementWidth * 10) / 100 -
            (elementToMoveToWidth * 10) / 100;
      howMuchToMove = finalHowMuchToMove;
    }
    line.current.animate(
      [
        {
          transform: `translateX(${howMuchToMove}px)`,
          width: `${(currentElementWidth * 80) / 100}px`,
          offset: 0,
        },
        {
          transform: `scaleX(0.25)`,
          offset: 0.5,
        },
        { transform: `scaleX(1)` },
      ],
      { duration: 1000, easing: "ease-in-out", fill: "both" },
    );
    setCurrentTab(index);
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
          <div ref={containerRef} className={`${style.stats}`}>
            <button
              onClick={() => {
                alternativeLineAnimationHandler(0);
                navigate("/profile");
              }}
            >
              Posts
            </button>
            <button
              onClick={() => {
                alternativeLineAnimationHandler(1);
                navigate("followers");
              }}
            >
              Followers
            </button>
            <button
              onClick={() => {
                alternativeLineAnimationHandler(2);
                navigate("following");
              }}
            >
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
