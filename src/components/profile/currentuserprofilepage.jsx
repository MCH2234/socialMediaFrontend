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
    line.current.className = `${style.line} ${initialLineStyle(splitParams)}`;
    setLineVisibility({
      visible: true,
      currentFocus: splitParams !== undefined ? splitParams : "posts",
    });
  }, []);

  const lineAnimationHandler = (moveTo) => {
    if (moveTo === currentTab) return;
    const elementToMoveTo =
      containerRef.current.children[moveTo].getBoundingClientRect();
    const currentElement =
      containerRef.current.children[currentTab].getBoundingClientRect();
    let left = 0;
    if (currentTab > 0) {
      for (let i = 0; i < currentTab; i++) {
        left += containerRef.current.children[i].getBoundingClientRect().width;
      }
    }
    left =
      left +
      (containerRef.current.children[currentTab].getBoundingClientRect().width *
        10) /
        100;
    line.current.style.left = `${left}px`; // starting position of the animation - centered under the tab where the animation started from
    const diff =
      moveTo > currentTab ? moveTo - currentTab : currentTab - moveTo; // how many tabs are there between current tab and the tab we want to switch to
    const currentElementWidth = currentElement.width;
    const elementToMoveToWidth = elementToMoveTo.width;
    let howMuchToMove = 0;
    let finalHowMuchToMove;
    if (diff === 1) {
      howMuchToMove =
        moveTo < currentTab
          ? -elementToMoveToWidth +
            (elementToMoveToWidth * 10) / 100 -
            (currentElementWidth * 10) / 100
          : currentElementWidth -
            (currentElementWidth * 10) / 100 +
            (elementToMoveToWidth * 10) / 100;
    } else if (diff > 1) {
      let start = moveTo > currentTab ? currentTab : moveTo;
      let end = moveTo > currentTab ? moveTo : currentTab;
      for (let j = start; j < end; j++) {
        howMuchToMove +=
          containerRef.current.children[j].getBoundingClientRect().width;
      }
      finalHowMuchToMove =
        moveTo < currentTab
          ? -howMuchToMove +
            (elementToMoveToWidth * 10) / 100 -
            (currentElementWidth * 10) / 100
          : +howMuchToMove -
            (currentElementWidth * 10) / 100 +
            (elementToMoveToWidth * 10) / 100;
      howMuchToMove = finalHowMuchToMove;
    }
    line.current.animate(
      [
        {
          transform: `translateX(0px)`,
          width: `${(currentElementWidth * 80) / 100}px`,
          offset: 0,
        },
        { transform: `translateX${howMuchToMove / 2}px`, offset: 0.25 },
        {
          transform: `scaleX(0.25) translateX(${howMuchToMove / 0.75}px)`,
          offset: 0.5,
        },
        {
          transform: `scaleX(1) translateX(${howMuchToMove}px)`,
          width: `${(elementToMoveToWidth * 80) / 100}px`,
          offset: 1,
        },
      ],
      { duration: 1000, easing: "ease-in-out", fill: "forwards" },
    );
    setCurrentTab(moveTo);
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
                lineAnimationHandler(0);
                navigate("/profile");
              }}
            >
              Posts
            </button>
            <button
              onClick={() => {
                lineAnimationHandler(1);
                navigate("followers");
              }}
            >
              Followers
            </button>
            <button
              onClick={() => {
                lineAnimationHandler(2);
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
