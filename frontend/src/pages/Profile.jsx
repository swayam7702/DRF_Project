import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Profile = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: ""
    });

    const [loading, setloading] = useState(true);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/v1/profile", {
            withCredentials: true
        })
            .then((res) => {
                setFormData(res.data);
            })
            .catch(() => {
                notify({
                    message: "Failed to get user data."
                })
            })
            .finally(() => setloading(false));
    }, [])

    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.name]: e.target.value
            }
        )
    };

    const handleUpdate = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.patch("http://127.0.0.1:8000/api/v1/profile", formData, {
                withCredentials: true
            })
            toast.success(response.data.message);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Update Failed!")
        }
    };

    if (loading) return <p>Getting User info....</p>

    return (
        <div style={{ border: "1px solid", maxWidth: "400pc", padding: "20px", }}>
            <form onSubmit={handleUpdate}>
                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <input name="email" value={formData.email} onChange={handleChange} />
                <button>Update Profile</button>
            </form>
        </div>
    )
}

export default Profile;