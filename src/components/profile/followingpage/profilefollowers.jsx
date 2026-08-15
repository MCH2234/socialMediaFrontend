import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import style from "./follow.module.css";
import FollowContainer from "./followinfo";

const ProfileFollowers = () => {
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const { follow, setFollow, fetchURL, JWT } = useOutletContext();

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    let ok;
    if (!follow.followers.followers) {
      fetch(`${fetchURL}/user/followers`, {
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
            console.log(r.followers);
            if (!ignore) {
              setLoading(false);
              setFollow({
                ...follow,
                followers: {
                  cursor: r.cursor,
                  followers: r.followers,
                },
              });
            }
          }
        });
    } else {
      setLoading(false);
    }
    return () => {
      controller.abort();
      ignore = true;
    };
  }, []);
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className={`flex col ${style.section} `}>
          {follow.followers.followers.map((follow) => (
            <FollowContainer key={follow.id} user={follow} text={["Remove"]} />
          ))}
        </section>
      )}
    </>
  );
};
export default ProfileFollowers;
