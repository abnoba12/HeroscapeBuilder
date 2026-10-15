import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { isAuthenticated } from "../../services/authService";
import { hasAccountFlag, LOGIN_REQUIRED_EVENT } from "../../services/local-db/local-account";

interface MyHeroscapeRouteProps {
    children: React.ReactElement;
}

/**
 * My Heroscape pages are open to everyone. Without an account the pages save to this browser only, so a banner
 * says so and recommends signing up; a browser that already belongs to an account is told to log in instead.
 */
const MyHeroscapeRoute: React.FC<MyHeroscapeRouteProps> = ({ children }) => {
    const signedIn = isAuthenticated();
    const [hasAccount, setHasAccount] = useState<boolean>(false);
    const [loginPrompt, setLoginPrompt] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (signedIn) return;
        let cancelled = false;
        hasAccountFlag().then(flag => { if (!cancelled) setHasAccount(flag); });
        const onLoginRequired = () => { setHasAccount(true); setLoginPrompt(true); };
        window.addEventListener(LOGIN_REQUIRED_EVENT, onLoginRequired);
        return () => {
            cancelled = true;
            window.removeEventListener(LOGIN_REQUIRED_EVENT, onLoginRequired);
        };
    }, [signedIn]);

    return (
        <>
            {!signedIn && (
                <Alert
                    severity={hasAccount ? "error" : "warning"}
                    variant="filled"
                    sx={{ mb: 2, fontSize: "1rem", alignItems: "center" }}
                    action={
                        hasAccount
                            ? <Button color="inherit" size="small" component={Link} to="/user/login">Log in</Button>
                            : <Button color="inherit" size="small" component={Link} to="/user/register">Sign up</Button>
                    }
                >
                    {hasAccount
                        ? "You already have an account. Log in to use My Heroscape so your data stays in one place; saving on this device without logging in is turned off."
                        : "Sign up to save your data. Without an account, what you enter here is stored only in this browser and can't be reached from any other device or browser. When you register, everything you've saved here is moved to your account automatically."}
                </Alert>
            )}
            {children}
            <Dialog open={loginPrompt} onClose={() => setLoginPrompt(false)}>
                <DialogTitle>Log in to continue</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This browser belongs to someone with an account. To keep your data in one place, please log in
                        before saving anything.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLoginPrompt(false)}>Not now</Button>
                    <Button variant="contained" onClick={() => navigate("/user/login")}>Log in</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MyHeroscapeRoute;
