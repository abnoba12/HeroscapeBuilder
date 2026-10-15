import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import { isAuthenticated } from "../../services/authService";
import { LOGIN_REQUIRED_EVENT } from "../../services/local-db/local-account";
import { useHasAccountFlag } from "../../services/local-db/use-has-account-flag";

interface MyHeroscapeRouteProps {
    children: React.ReactElement;
}

/**
 * My Heroscape is open to logged-in users and to visitors without an account. Without an account the pages save
 * to this browser only, so a banner says so and recommends signing up. A logged-out browser that already belongs
 * to an account cannot use these pages and is sent to log in.
 */
const MyHeroscapeRoute: React.FC<MyHeroscapeRouteProps> = ({ children }) => {
    const signedIn = isAuthenticated();
    const hasAccount = useHasAccountFlag();
    const navigate = useNavigate();

    // An account created elsewhere (another tab) can show up mid-session; the refused save sends them to log in.
    useEffect(() => {
        if (signedIn) return;
        const onLoginRequired = () => navigate("/user/login");
        window.addEventListener(LOGIN_REQUIRED_EVENT, onLoginRequired);
        return () => window.removeEventListener(LOGIN_REQUIRED_EVENT, onLoginRequired);
    }, [signedIn, navigate]);

    if (signedIn) return children;
    if (hasAccount === null) return null;
    if (hasAccount) return <Navigate to="/user/login" replace />;

    return (
        <>
            <Alert
                severity="warning"
                variant="filled"
                sx={{ mb: 2, fontSize: "1rem", alignItems: "center" }}
                action={<Button color="inherit" size="small" component={Link} to="/user/register">Sign up</Button>}
            >
                Sign up to save your data. Without an account, what you enter here is stored only in this browser and
                can't be reached from any other device or browser. When you register, everything you've saved here is
                moved to your account automatically.
            </Alert>
            {children}
        </>
    );
};

export default MyHeroscapeRoute;
