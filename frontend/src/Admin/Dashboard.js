import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import Header from "../Layout/Header";
import UserDetails from "./UserDetails";
import EmployeeDetails from "./EmployeeDetails";

const Dashboard = () => {
    const [selectedOption, setSelectedOption] = useState("Survey Details");

    const renderContent = () => {
        switch (selectedOption) {
            case "Survey Details":
                return <UserDetails />;
            case "Employee Details":
                return <EmployeeDetails />;
            default:
                return <h2>Welcome to the Dashboard</h2>;
        }
    };

    return (
        <>
            <Header />
            <div className="dashboard-container d-flex">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile-section text-center">
                        <div className="profile-pic">Admin</div>
                        <p className="user-name">Admin</p>
                        <p className="user-role">Admin Manager</p>
                    </div>
                    <ul className="nav flex-column">
                        <li className={`nav-item ${selectedOption === "Survey Details" ? "active" : ""}`}>
                            <button className="nav-link btn btn-link text-start" onClick={() => setSelectedOption("Survey Details")}>
                                Survey Details
                            </button>
                        </li>
                        <li className={`nav-item ${selectedOption === "Employee Details" ? "active" : ""}`}>
                            <button className="nav-link btn btn-link text-start" onClick={() => setSelectedOption("Employee Details")}>
                                Employee Details
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="content flex-grow-1 p-3">
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
