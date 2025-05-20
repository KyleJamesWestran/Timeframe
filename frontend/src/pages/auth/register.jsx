import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSchool } from "../../controllers/auth_controller"; // Import the function

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        user: {
            username: "",
            email: "",
            password: ""
        }
    });

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith("user_")) {
            setFormData({
                ...formData,
                user: { ...formData.user, [name.replace("user_", "")]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createSchool(formData, navigate, setMessage, setLoading);
            window.location.href = "/dashboard"; // Redirect after successful registration
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Register School</h2>
            
            {message && (
                <div className={`p-2 rounded text-sm ${message.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                    {message.text}
                </div>
            )}

            {error && <div className="p-2 bg-red-100 rounded text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* School Details */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">School Details</h3>
                    <input type="text" name="name" placeholder="School Name" value={formData.name} onChange={handleChange} required className="input-primary w-full p-2 border rounded" />
                    <input type="email" name="email" placeholder="School Email" value={formData.email} onChange={handleChange} required className="input-primary w-full p-2 border rounded" />
                </div>

                {/* User Details */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">User Details</h3>
                    <input type="text" name="user_username" placeholder="Username" value={formData.user.username} onChange={handleChange} required className="input-primary w-full p-2 border rounded" />
                    <input type="email" name="user_email" placeholder="User Email" value={formData.user.email} onChange={handleChange} required className="input-primary w-full p-2 border rounded" />
                    <input type="password" name="user_password" placeholder="Password" value={formData.user.password} onChange={handleChange} required className="input-primary w-full p-2 border rounded" />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full p-2 border rounded">
                    {loading ? "Registering..." : "Register School"}
                </button>
            </form>
        </div>
    );
};

export default Register;
