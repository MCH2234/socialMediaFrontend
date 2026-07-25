import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import style from "./home.module.css";
const fetchURL = "http://localhost:3214/api/v1";
const MainPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  let token =
    JSON.parse(localStorage.getItem("token")) !== null
      ? JSON.parse(localStorage.getItem("token"))
      : null;

  const [JWT, setJWT] = useState(token);

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
            setUser(r.user);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

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
              <nav className={`flex row ${style.nav}`}>
                <ul className={`flex row ${style.navItems}`}>
                  {JWT
                    ? userNavItems.map((item, index) => (
                        <li key={index} onClick={item.onClick}>
                          {item.text}
                        </li>
                      ))
                    : guestNavItems.map((item, index) => (
                        <li key={index} onClick={() => navigate(item.path)}>
                          {item.text}
                        </li>
                      ))}
                </ul>
              </nav>
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
