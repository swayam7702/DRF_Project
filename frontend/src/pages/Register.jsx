import React, { useState } from 'react'
import axios from 'axios'
const Register = () => {
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

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            ...formData
        }
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/register/", userData);
            alert("Registration successful!");
            console.log("wertyuytr",response);
        } catch (error) {
            console.error("Error registering:", error);
            alert("Registration failed. Please try again.");
        }
    };

    console.log(formData,"erty")
    return (
        <div style={formStyle}>
            <h2 style={headingStyle}>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} style={inputStyle} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} />
                <button type="submit" style={buttonStyle}>Register</button>
            </form>
        </div>
    );
}

export default Register
