import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import api from "../services/api";
import "./Signup.css";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setSuccess("");
        setError("");

        try {

            await api.post("/auth/signup", formData);

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {

            if (err.response) {
                setError(err.response.data.detail);
            } else {
                setError("Server Error");
            }

        }

    }

    return (

        <div className="signup-container">

            <div className="signup-card">

                <h1 className="signup-title">
                    <FaBrain /> NeuroAI
                </h1>

                <p className="signup-subtitle">
                    Create your NeuroAI account
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="input-group">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="input-group">

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button className="signup-btn">
                        Create Account
                    </button>

                </form>

                {success && (
                    <p className="success">
                        ✅ {success}
                    </p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <div className="login-link">

                    Already have an account?

                    <br />

                    <Link to="/login">
                        Login Here
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Signup;