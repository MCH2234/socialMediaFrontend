import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import style from "./follow.module.css";

const ProfileFollowing = () => {
  const [loading, setLoading] = useState(true);
  const { follow, setFollow, fetchURL, JWT } = useOutletContext();
  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    let ok;
    if (!follow.following.following) {
      fetch(`${fetchURL}/user/following`, {
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
            console.log(r.following);
            if (!ignore) {
              setLoading(false);
              setFollow({
                ...follow,
                following: {
                  cursor: r.cursor,
                  following: r.following,
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
        <section className={`flex col ${style.section}`}></section>
      )}
    </>
  );
};
export default ProfileFollowing;
