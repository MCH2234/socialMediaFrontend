import { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router";

const Logout = () => {
  const { user } = useOutletContext();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <p>Browse page</p>;
};

export default Logout;
