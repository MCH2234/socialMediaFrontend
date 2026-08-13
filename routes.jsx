import { createBrowserRouter } from "react-router";
import ErrorPage from "./src/components/errorpage";
import Login from "./src/components/login";
import Signup from "./src/components/signup";
import Following from "./src/components/following";
import Browse from "./src/components/browse";
import MainPage from "./src/components/post/mainpage";
import HomePage from "./src/components/home/hompage";
import CurrentUserProfile from "./src/components/profile/currentuserprofilepage";
import UserPosts from "./src/components/profile/userposts/postsprofile";
import ProfileFollowing from "./src/components/profile/followingpage/profilefollowing";
import ProfileFollowers from "./src/components/profile/followingpage/profilefollowers";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/login",
        element: <Login />,
      },
      { path: "/signup", element: <Signup /> },
      { path: "/following", element: <Following /> },
      { path: "/browse", element: <Browse /> },
      {
        path: "/profile",
        element: <CurrentUserProfile />,
        children: [
          { index: true, element: <UserPosts /> },
          { path: "following", element: <ProfileFollowing /> },
          {
            path: "followers",
            element: <ProfileFollowers />,
          },
        ],
      },
    ],
  },
]);

export default routes;
