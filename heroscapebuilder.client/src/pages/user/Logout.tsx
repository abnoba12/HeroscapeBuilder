import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Clear the JWT token
        navigate("/"); // Redirect to login page
    }, [navigate]);

    return <p>Logging out...</p>;
};

export default Logout;
