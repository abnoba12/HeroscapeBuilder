import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmEmail } from "../../services/authService";
import "./user.scss";

const ConfirmEmail: React.FC = () => {
    const [params] = useSearchParams();
    const [status, setStatus] = useState<"working" | "ok" | "failed">("working");
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return; // a token is single use, so don't confirm twice
        started.current = true;
        const userId = params.get("userId");
        const token = params.get("token");
        if (!userId || !token) {
            setStatus("failed");
            return;
        }
        confirmEmail(userId, token).then(() => setStatus("ok")).catch(() => setStatus("failed"));
    }, [params]);

    return (
        <div className="user-container">
            <h2>Confirm Email</h2>
            {status === "working" && <p>Confirming your email...</p>}
            {status === "ok" && <p>Your email is confirmed. <Link to="/user/login">Log in</Link></p>}
            {status === "failed" && <p>This confirmation link is invalid or has expired. Try logging in to request a new one. <Link to="/user/login">Go to login</Link></p>}
        </div>
    );
};

export default ConfirmEmail;
