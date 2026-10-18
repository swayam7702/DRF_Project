import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_ID = "login-toast";

export const notify = ({ message, type }) => {
  const safeMessage =
    typeof message === "string"
      ? message
      : "Something went wrong.";

  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, {
      render: safeMessage,
      type,
      isLoading: type === "info",
      autoClose: type === "info" ? false : 3000,
    });
  } else {
    toast(safeMessage, {
      toastId: TOAST_ID,
      type,
      isLoading: type === "info",
      autoClose: type === "info" ? false : 3000,
    });
  }
};

const getErrorMessage = (error) => {
  const errorData = error?.response?.data;

  if (!errorData) {
    return "Unable to connect to the server.";
  }

  if (typeof errorData.message === "string") {
    return errorData.message;
  }

  if (Array.isArray(errorData.message)) {
    return errorData.message[0];
  }

  if (typeof errorData.detail === "string") {
    return errorData.detail;
  }

  if (errorData.non_field_errors?.length) {
    return errorData.non_field_errors[0];
  }

  const firstField = Object.keys(errorData)[0];

  if (
    firstField &&
    Array.isArray(errorData[firstField])
  ) {
    return errorData[firstField][0];
  }

  if (
    firstField &&
    typeof errorData[firstField] === "string"
  ) {
    return errorData[firstField];
  }

  return "Login failed.";
};

const LogInPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.password) {
      notify({
        message: "Username and password are required.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    notify({
      message: "Logging in...",
      type: "info",
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/login/",
        formData
      );

      console.log("HTTP status:", response.status);
console.log("Full Axios response:", response);
console.log("Backend response body:", response.data);
console.log("Nested data:", response.data?.data);

      const responseData = response.data;
      const loginData = responseData.data;

      localStorage.setItem("accessToken", loginData.access);
      localStorage.setItem("refreshToken", loginData.refresh);
      localStorage.setItem(
        "user",
        JSON.stringify(loginData.user)
      );

      notify({
        message: responseData.message || "Login successful.",
        type: "success",
      });

      setFormData({
        username: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      console.error("Backend response:", error?.response?.data);

      notify({
        message: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: "16px",
    opacity: loading ? 0.7 : 1,
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  };

  return (
    <div style={formStyle}>
      <h2 style={headingStyle}>Log In</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          style={inputStyle}
          value={formData.username}
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={inputStyle}
          value={formData.password}
          disabled={loading}
        />

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <Link to="/register">New User?</Link>
      </form>

      <ToastContainer />
    </div>
  );
};

export default LogInPage;