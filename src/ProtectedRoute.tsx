import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getJSON } from "./utils";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // if (!token||!getJSON(localStorage.getItem("token"))) {
  //   return <Navigate to="/sign-in" replace />;
  // }

  return <Outlet />;
};
export default ProtectedRoute;
