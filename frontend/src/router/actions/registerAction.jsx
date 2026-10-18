import axios from "axios";
import { redirect } from "react-router";
import getErrorMessage from "../../utils/getErrorMessage";

export const registerAction = async ({ request }) => {
  const formData = await request.formData();

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!username || !email || !password) {
    return {
      error: "All fields are required.",
    };
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/register/",
      {
        username,
        email,
        password,
      }
    );

    if (response?.status === 201) {
      return redirect("/login");
    }

    return {
      error: "Registration failed.",
    };
  } catch (error) {
    console.error("Register error:", error?.response?.data || error);

    return {
      error: getErrorMessage(error),
    };
  }
};