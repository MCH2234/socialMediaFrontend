import { createBrowserRouter } from "react-router";
import ErrorPage from "./src/components/errorpage";
import Login from "./src/components/login";
import Signup from "./src/components/signup";
import Following from "./src/components/following";
import Browse from "./src/components/browse";
import MainPage from "./src/components/mainpage";
import HomePage from "./src/components/hompage";

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
    ],
  },
]);

export default routes;
