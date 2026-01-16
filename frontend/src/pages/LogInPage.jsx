import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const LogInPage = () => {
    const navigate = useNavigate();
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
    };

    const buttonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    };

    const headingStyle = {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    };
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    // formData.name = "New Value"
    // formData.email = "New Value"
    // formData.password = "New Value"

    const TOAST_ID = "login-toast";

    const notify = ({ message, type }) => {
        if (toast.isActive(TOAST_ID)) {
            toast.update(TOAST_ID, {
                render: message,
                type,
                isLoading: type === "info",
                autoClose: type === "info" ? false : 3000,
            });

        } else {
            toast(message, {
                toastId: TOAST_ID,
                render: message,
                type,
                isLoading: type === "info",
                autoClose: type === "info" ? false : 3000,
            }
            )
        }
    }


    const handleChange = (e) => {

        console.log(e.target.name, ":", e.target.value, "ertytreer")
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        notify(
            {
                message: "Logging in.....",
                type: "info"
            }
        )
        const userData = {
            ...formData
        }

        console.log(userData, "payload while submiting")
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/login/", userData);
            if (response?.status === 200) {
                localStorage.setItem("authUser", JSON.stringify(response.data.user));
                notify({ message: response.data.message, type: "success" });
                navigate("/");
            }

            setFormData({
                username: "",
                password: "",
            })
        } catch (error) {
            const errMessage = error?.response?.data?.message;
            notify({
                message: errMessage || "Registration Failed!",
                type: "error"
            }
            )
        } finally {
            setLoading(false)
        }
    };


    return (
        <div style={formStyle}>
            <h2 style={headingStyle}>LogIn Page</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} style={inputStyle} />
                {/* <input type="email" name="email" placeholder="Email" onChange={handleChange} style={inputStyle} /> */}
                <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} />
                <button type="submit" style={buttonStyle}>LogIn</button>
                <Link to="/register">New User?</Link>
                <ToastContainer />
            </form>
        </div>
    );
}

export default LogInPage
