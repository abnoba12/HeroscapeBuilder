import React from "react";
import { Navigate } from "react-router-dom";
import { hasRole, isAuthenticated } from "../../services/authService";

interface AdminRouteProps {
    children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/user/login" replace />;
    }

    return hasRole("Admin") ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
