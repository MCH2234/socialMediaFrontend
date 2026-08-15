import { useState } from "react";
import style from "./follow.module.css";
const FollowContainer = ({ user, text, onClick }) => {
  const initials = user.first[0].toUpperCase() + user.last[0].toUpperCase();
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className={`flex row ${style.user}`}>
      <a href className={`flex row ${style.following}`}>
        <div className={`${style.pfp}`}>
          <p>{initials}</p>
        </div>
        <div className={`flex col ${style.names}`}>
          <p className={`${style.firstLast}`}>
            {user.first} {user.last}
          </p>
          <p className={`${style.username}`}>@{user.user}</p>
        </div>
      </a>
      {
        <button
          onClick={onClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`${style.unfollowBtn} ${text.length === 1 ? style.removeBtn : ""}`}
        >
          {text.length > 1 ? (isHovering ? text[0] : text[1]) : "Remove"}
        </button>
      }
    </div>
  );
};
export default FollowContainer;
