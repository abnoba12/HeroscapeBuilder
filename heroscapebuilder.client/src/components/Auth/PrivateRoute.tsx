import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

interface PrivateRouteProps {
    children: React.ReactElement; // The component to render
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuth = isAuthenticated();

    return isAuth ? children : <Navigate to="/user/login" replace />;
};

export default PrivateRoute;
