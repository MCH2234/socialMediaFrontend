import { Outlet, useNavigate, useOutletContext } from "react-router";
import { useRef, useState } from "react";
import style from "./profile.module.css";
const CurrentUserProfile = () => {
  const { JWT, user } = useOutletContext();
  const initials = user.first[0].toUpperCase() + user.last[0].toUpperCase();
  const [lineVisibility, setLineVisibility] = useState({
    visible: true,
    currentFocus: "",
  });

  const line = useRef(null);

  const navigate = useNavigate();

  const lineAnimationHandler = (current) => {
    if (lineVisibility.visible === false) {
      setLineVisibility({ visible: true, currentFocus: current });
    } else if (lineVisibility.visible) {
      if (lineVisibility.currentFocus === "") {
        setLineVisibility({ ...lineVisibility, currentFocus: current });
        line.current.className = `${style.line} ${current === "followers" ? style.showOnFollowers : style.showOnFollowing}`;
        navigate(`${current}`);
      }
      if (
        lineVisibility.currentFocus === "following" &&
        current === "followers"
      ) {
        line.current.className = `${style.line} ${style.moveToFollowers}`;
        setLineVisibility({ ...lineVisibility, currentFocus: "followers" });
        navigate("followers");
      } else if (
        lineVisibility.currentFocus === "followers" &&
        current === "following"
      ) {
        line.current.className = `${style.line} ${style.moveToFollowing}`;
        setLineVisibility({ ...lineVisibility, currentFocus: "following" });
        navigate("following");
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
            <button onClick={() => lineAnimationHandler("followers")}>
              Followers: {user._count.followers}
            </button>
            <button onClick={() => lineAnimationHandler("following")}>
              Following: {user._count.following}
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
      <section className={`flex col ${style.mainContent}`}>
        <Outlet />
      </section>
    </main>
  );
};
export default CurrentUserProfile;
