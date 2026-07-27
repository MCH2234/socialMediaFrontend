import { useState, useEffect } from "react";
import style from "./auth.module.css";
import { useNavigate, useOutletContext } from "react-router";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [inputValue, setInputValues] = useState({
    user: "",
    password: "",
  });
  const { fetchURL, JWT, setJWT } = useOutletContext();

  useEffect(() => {
    if (!JWT) {
      setLoading(false);
    } else {
      navigate("/");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const r = await fetch(`${fetchURL}/auth/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: inputValue.user,
        password: inputValue.password,
      }),
    });
    const body = await r.json();
    if (r.status >= 200 && r.status <= 299) {
      localStorage.setItem("token", JSON.stringify(body.token));
      navigate("/");
      setJWT(body.token);
    } else {
      setErrors(body.error);
    }
  };
  return (
    <>
      {!loading ? (
        <form className={`flex col ${style.signup}`}>
          {errors.length >= 1 ? (
            <ul>
              {errors.map((error, index) => (
                <li className={`${style.error}`} key={index}>
                  {error}
                </li>
              ))}
            </ul>
          ) : null}
          <label htmlFor="user">Username</label>
          <input
            type="text"
            id="user"
            name="user"
            placeholder="username"
            value={inputValue.user}
            onChange={(e) =>
              setInputValues({ ...inputValue, user: e.target.value })
            }
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="*********"
            value={inputValue.password}
            onChange={(e) =>
              setInputValues({ ...inputValue, password: e.target.value })
            }
          />
          <button onClick={onSubmit}>Login</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Login;
