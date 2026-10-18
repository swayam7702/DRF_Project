import axios from "axios";
import { redirect } from "react-router";
import getErrorMessage from "../../utils/getErrorMessage";


export const loginAction = async ({ request }) => {
  const formData = await request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return {
      error: "Username and password are required.",
    };
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/login/",
      {
        username,
        password,
      }
    );

    const loginData = response.data.data;

    localStorage.setItem("accessToken", loginData.access);
    localStorage.setItem("refreshToken", loginData.refresh);
    localStorage.setItem("user", JSON.stringify(loginData.user));

    return redirect("/");
  } catch (error) {
    console.error("Login error:", error?.response?.data || error);

    return {
      error: getErrorMessage(error),
    };
  }
};