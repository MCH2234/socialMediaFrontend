import { useState } from "react";
import style from "./post.module.css";
import { useOutletContext } from "react-router";
const AddPost = ({ posts, setPosts }) => {
  const [input, setInput] = useState("");
  const { JWT, fetchURL } = useOutletContext();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${fetchURL}/post`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT}`,
        },
        method: "post",
        body: JSON.stringify({
          text: input,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error("An error occured");
      } else {
        console.log(body.post);
        setPosts([body.post, ...posts]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className={`flex col ${style.addPostForm}`}>
      <textarea
        className={`${style.add}`}
        placeholder="What's on your mind?"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></textarea>
      <button onClick={onSubmit}>Submit</button>
    </form>
  );
};
export default AddPost;
