import { redirect } from "react-router";

export const guestLoader = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return redirect("/");
  }

  return null;
};