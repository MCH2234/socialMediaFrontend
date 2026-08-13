import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Top from "../../assets/arrowup.svg";
import style from "../home/home.module.css";
import Profile from "../../assets/profile.svg";
import FollowRequest from "../../assets/fr.svg";
const fetchURL = "http://localhost:3214/api/v1";
const MainPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [followRequests, setFollowRequests] = useState({
    requests: [],
    show: false,
  });
  const [skipToTheTopVisibility, setSkipToTheTopVisibility] = useState(false);

  let navBar = useRef(null);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting === false) {
          setSkipToTheTopVisibility(true);
        } else {
          setSkipToTheTopVisibility(false);
        }
      });
    },
    { threshold: 0.1 },
  );

  useEffect(() => {
    if (followRequests.show === true) {
      window.document.body.style = "overflow:hidden";
    } else {
      window.document.body.style = "";
    }
  }, [followRequests.show]);

  useEffect(() => {
    if (loading) return;
    observer.observe(navBar.current);
    return () => observer.disconnect();
  }, [loading]);

  let token =
    JSON.parse(localStorage.getItem("token")) !== null
      ? JSON.parse(localStorage.getItem("token"))
      : null;

  const [JWT, setJWT] = useState(token);

  const acceptFollowRequest = async (request) => {
    try {
      const response = await fetch(`${fetchURL}/user/follow/${request.id}`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        const filterRequests = followRequests.requests.filter(
          (req) => req !== request,
        );
        setFollowRequests({
          show: filterRequests.length === 0 ? false : true,
          requests: filterRequests,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const declineFollowRequest = async (request) => {
    try {
      const response = await fetch(`${fetchURL}/user/follow/${request.id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        method: "DELETE",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        const filterRequests = followRequests.requests.filter(
          (req) => req !== request,
        );
        setFollowRequests({
          show: filterRequests.length === 0 ? false : true,
          requests: filterRequests,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${fetchURL}/auth/logout`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message);
      } else {
        setUser(null);
        setJWT(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    let ok;
    if (JWT) {
      fetch(`${fetchURL}/user`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      })
        .then((r) => {
          ok = r.ok;
          return r.json();
        })
        .then((r) => {
          if (!ok) {
            throw new Error(r.error);
          } else {
            if (!ignore) setUser(r.user);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setFollowRequests({ requests: [], show: false });
    }
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [JWT]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    if (user) {
      let ok;
      fetch(`${fetchURL}/user/follow/request`, {
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
            if (!ignore)
              setFollowRequests({ show: false, requests: r.requests });
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
      return () => {
        ignore = true;
        controller.abort();
      };
    }
  }, [user]);

  const userNavItems = [
    {
      text: "Home",
      onClick: () => navigate("/"),
    },
    { text: "Following", onClick: () => navigate("/following") },
    { text: "Browse", onClick: () => navigate("/browse") },
    { text: "Logout", onClick: () => logout() },
  ];
  const guestNavItems = [
    { text: "Signup", path: "/signup" },
    { text: "Login", path: "/login" },
  ];
  return (
    <>
      {!loading ? (
        <>
          {!error ? (
            <>
              <nav ref={navBar} className={`flex row ${style.nav}`}>
                <ul className={`flex row ${style.navItems}`}>
                  {JWT ? (
                    <>
                      {userNavItems.map((item, index) => (
                        <li key={index} onClick={item.onClick}>
                          {item.text}
                        </li>
                      ))}
                      <img
                        onClick={() => navigate("profile")}
                        className={`${style.profileIcon}`}
                        src={Profile}
                        height="20px"
                        width="20px"
                      />
                    </>
                  ) : (
                    guestNavItems.map((item, index) => (
                      <li key={index} onClick={() => navigate(item.path)}>
                        {item.text}
                      </li>
                    ))
                  )}
                </ul>

                {user && followRequests.requests.length >= 1 ? (
                  <div
                    onClick={() =>
                      setFollowRequests({
                        ...followRequests,
                        show: !followRequests.show,
                      })
                    }
                    className={`${style.followRequests}`}
                  >
                    <img src={FollowRequest} width="30px" height="30px" />
                    <div className={`${style.followCount}`}>
                      {followRequests.requests.length}
                    </div>
                  </div>
                ) : null}
                {followRequests.requests.length >= 1 &&
                followRequests.show === true ? (
                  <div className={`${style.follow}`}>
                    <ul className={`flex col ${style.list}`}>
                      {followRequests.requests.map((request) => (
                        <li
                          className={`flex row ${style.followContent}`}
                          key={request.id}
                        >
                          <a className={`flex col ${style.userName}`}>
                            <span className={`${style.followName}`}>
                              {request.from.first} {request.from.last}
                            </span>
                            <span>@{request.from.user}</span>
                          </a>
                          <div className={`flex col ${style.requestButtons}`}>
                            <button
                              onClick={() => acceptFollowRequest(request)}
                              className={"main-button-style"}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => declineFollowRequest(request)}
                              className={"main-button-style"}
                            >
                              Decline
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </nav>
              {skipToTheTopVisibility ? (
                <img
                  src={Top}
                  onClick={() =>
                    navBar.current.scrollIntoView({
                      behavior: "smooth",
                      block: "end",
                      inline: "nearest",
                    })
                  }
                  width="30px"
                  height="30px"
                  className={`${style.toTheTop}`}
                />
              ) : null}
              <Outlet context={{ JWT, setJWT, fetchURL, user }} />{" "}
            </>
          ) : (
            <p>{error}</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default MainPage;
