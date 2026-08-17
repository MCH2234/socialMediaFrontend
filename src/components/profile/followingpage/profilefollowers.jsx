import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import style from "./follow.module.css";
import FollowContainer from "./followinfo";

const ProfileFollowers = () => {
  const [loading, setLoading] = useState(true);
  const { follow, setFollow, fetchURL, JWT } = useOutletContext();

  const removeFollower = async (user) => {
    try {
      const response = await fetch(
        `${fetchURL}/user/follow/remove/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          method: "DELETE",
        },
      );
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error);
      } else {
        const filterFollowers = follow.followers.followers.filter(
          (follow) => follow !== user,
        );
        const copyFollowers = { ...follow.followers };
        copyFollowers.followers = filterFollowers;
        const copyFollow = { ...follow, followers: copyFollowers };
        setFollow(copyFollow);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
          {follow.followers.followers.length >= 1 ? (
            follow.followers.followers.map((follow) => (
              <FollowContainer
                key={follow.id}
                user={follow}
                text={["Remove"]}
                onClick={() => removeFollower(follow)}
              />
            ))
          ) : (
            <p>You don't have any followers</p>
          )}
        </section>
      )}
    </>
  );
};
export default ProfileFollowers;
