import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import style from "./auth.module.css";
const Signup = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [inputValues, setInputValues] = useState({
    user: "",
    password: "",
    first: "",
    last: "",
  });
  const navigate = useNavigate();
  const { fetchURL, user } = useOutletContext();

  useEffect(() => {
    if (!user) {
      setLoading(false);
    } else {
      navigate("/");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${fetchURL}/auth/signup`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: inputValues.user,
          password: inputValues.password,
          first: inputValues.first,
          last: inputValues.last,
        }),
      });
      if (r.status >= 200 && r.status <= 299) {
        const body = await r.json();
        console.log(body.message);
        navigate("/login");
      } else {
        const body = await r.json();
        console.log(body.error);
        setErrors(body.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {!loading ? (
        <form className={`flex col ${style.signup}`}>
          {errors.length >= 1 ? (
            <ul>
              {errors.map((err, index) => (
                <li className={`${style.error}`} key={index}>
                  {err}
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
            value={inputValues.user}
            onChange={(e) =>
              setInputValues({ ...inputValues, user: e.target.value })
            }
          />
          <label htmlFor="password">Password</label>
          <input
            placeholder="**********"
            type="password"
            id="password"
            name="password"
            value={inputValues.password}
            onChange={(e) =>
              setInputValues({ ...inputValues, password: e.target.value })
            }
          />
          <label htmlFor="first">First name</label>
          <input
            placeholder="John"
            type="text"
            id="first"
            name="first"
            value={inputValues.first}
            onChange={(e) =>
              setInputValues({ ...inputValues, first: e.target.value })
            }
          />
          <label htmlFor="last">Last name</label>
          <input
            type="text"
            id="first"
            name="first"
            placeholder="Doe"
            value={inputValues.last}
            onChange={(e) =>
              setInputValues({ ...inputValues, last: e.target.value })
            }
          />
          <button onClick={onSubmit}>Sign up</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Signup;
