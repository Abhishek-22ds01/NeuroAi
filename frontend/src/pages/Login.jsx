import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });

    const [message,setMessage]=useState("");
    const [error,setError]=useState("");

    function handleChange(e){

        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });

    }

    async function handleSubmit(e){

        e.preventDefault();

        setError("");
        setMessage("");

        try{

            const form=new URLSearchParams();

            form.append("username",formData.email);
            form.append("password",formData.password);

            const response=await api.post(
                "/auth/login",
                form,
                {
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded",
                    },
                }
            );

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            navigate("/dashboard");

        }
        catch(err){

            if(err.response){

                setError(err.response.data.detail);

            }
            else{

                setError("Server Error");

            }

        }

    }

    return(

        <div className="login-container">

            <div className="login-card">

                <h1 className="login-title">
                    <FaBrain/> NeuroAI
                </h1>

                <p className="login-subtitle">
                    AI Powered Medical Report Analyzer
                </p>

                <form onSubmit={handleSubmit}>

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

                    <button className="login-btn">
                        Login
                    </button>

                </form>

                {message && (
                    <p className="success">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <div className="signup-link">

                    Don't have an account?

                    <br/>

                    <Link to="/signup">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;