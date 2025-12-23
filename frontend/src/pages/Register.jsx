import React, { useState } from 'react'
import axios from 'axios'
import { Navigate, redirect } from 'react-router-dom';
// import {ToastContainer} from ''
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Register = () => {
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
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    // const notify = (message) => toast({
    //     render: message.messgae,
    //     autoClose: loading,
    //     type: message.type
    // });


    const notify = (message) => {
        console.log(message, "messageeee")
        if (message?.type === "info") {
            toast(message?.message)
        }
        else if (message?.type === "success") {
            toast.success(message?.message)
        }
        else if (message?.type === "error") {
            toast.error(message?.message)
        }
    };

    const handleChange = (e) => {

        console.log(e.target.name, ":", e.target.value, "ertytreer")
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    console.log(formData, "formDattaa")


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            ...formData
        }
        notify({
            message: "Creating An account....!",
            type: "info"
        })

        console.log(userData, "payload while submiting")
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/regist/", userData);

            console.log("wertyuytr", response);
            setFormData({
                username: "",
                email: "",
                password: "",
            })

            if (response?.status == 201) {
                notify({
                    message: "Registration Success!",
                    type: "success"
                })
                navigate("/")
                setFormData({})
            }

        } catch (error) {
            console.error("Error registering:", error);
            // alert("Registration failed. Please try again.");
            // notify = () => toast("Registration Failed!");
            notify({
                message: "Registration Failed!",
                type: "error"
            })
        } finally {
            setLoading(false)
        }
    };


    return (
        <div style={formStyle}>
            <h2 style={headingStyle}>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} style={inputStyle} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} />
                <div>
                    <button style={buttonStyle}>Register!</button>
                    {/* <button type="submit" style={buttonStyle}>Register</button> */}
                    <ToastContainer />
                </div>
            </form>
        </div>
    );
}

export default Register
