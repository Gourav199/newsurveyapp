import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminLogin.css";
import LoginService from "../Service/LoginService";
import { trackPromise } from "react-promise-tracker";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
      });
    
      const [error, setError] = useState("");
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
    
        console.log("Login Data:", formData);
    
        trackPromise(
          LoginService.loginUser(formData)
            .then((res) => {
              console.log("Response from API:", res);
    
              if (res.status === 200) {
                // ✅ Store user data (optional)
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
    
    
                // ✅ Navigate to SurveyForm.js after successful login
                navigate("/dashboard");
              } else {
                throw new Error(res.data.message || "Login failed");
              }
            })
            .catch((err) => {
              console.error("Login error:", err);
              setError("Invalid username or password"); // Show error message
            })
        );
      };
  return (
    <>
    
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border-0 overflow-hidden" style={{ width: "800px" }}>
        <div className="row g-0">
          {/* Left Side - Login Form */}
          <div className="col-md-6 p-4 d-flex flex-column justify-content-center text-center">
            <img src="/logo.png" alt="Logo" className="mb-3" style={{ width: "100px", alignSelf: "center" }} />
            <h4 className="mb-3">The Survey App</h4>
            <p>Admin Login</p>
            {error && <p className="text-danger">{error}</p>} {/* ✅ Show error message if login fails */}
            <form>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                name="userName"
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                name="password"
              />
              <button
                className="btn btn-danger w-100"
                style={{ background: "linear-gradient(to right, #ff7e5f, #c63d96)" }}
                onClick={handleSubmit}
              >
                LOG IN
              </button>
            </form>
            <a href="#" className="mt-2 text-muted small">
              Forgot password?
            </a>
            <div className="mt-3">
              <span>Don't have an account?</span>{" "}
              <button className="btn btn-outline-danger btn-sm ms-2">CREATE NEW</button>
            </div>
          </div>

          {/* Right Side - Info Section */}
          <div
            className="col-md-6 text-white d-flex flex-column justify-content-center p-4"
            style={{ background: "linear-gradient(to right, #ff7e5f, #c63d96)" }}
          >
            <h4>We are more than just a company</h4>
            <p className="small">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
