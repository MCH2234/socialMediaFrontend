import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import style from "./follow.module.css";
import FollowContainer from "./followinfo";

const ProfileFollowing = () => {
  const [loading, setLoading] = useState(true);
  const { follow, setFollow, fetchURL, JWT } = useOutletContext();

  const unfollowUser = async (user) => {
    try {
      const response = await fetch(`${fetchURL}/user/follow/${user.id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: "DELETE",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        console.log(body);
        const filterFollowing = follow.following.following.filter(
          (following) => following != user,
        );
        const copyFollowing = { ...follow.following };
        copyFollowing.following = filterFollowing;
        const copyFollow = { ...follow, following: copyFollowing };
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
        <section className={`flex col ${style.section}`}>
          {follow.following.following.length >= 1 ? (
            follow.following.following.map((follow) => (
              <FollowContainer
                key={follow.id}
                user={follow}
                text={["Unfollow", "Following"]}
                onClick={() => unfollowUser(follow)}
              />
            ))
          ) : (
            <p>You don't follow any users</p>
          )}
        </section>
      )}
    </>
  );
};
export default ProfileFollowing;
