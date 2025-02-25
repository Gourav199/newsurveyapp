import React, { useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // For navigation

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear session storage/local storage or cookies
    // localStorage.removeItem("authToken"); // If using localStorage
    sessionStorage.removeItem("user"); // If using sessionStorage
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // If using cookies

    // Redirect to login page
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3 header-color">
      <span className="navbar-brand">The Survey App</span>
      <div className="position-relative" ref={dropdownRef}>
        <a href="#profile" className="text-light" onClick={toggleDropdown}>
          <FaUserCircle size={30} />
        </a>
        {showDropdown && (
          <div className="dropdown-menu dropdown-menu-end show position-absolute end-0 mt-2">
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
