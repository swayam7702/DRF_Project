import { redirect } from "react-router";

export const authLoader = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return redirect("/login");
  }

  return null;
};