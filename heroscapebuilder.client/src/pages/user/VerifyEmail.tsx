import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmEmail } from "../../services/authService";
import "./user.scss"; // Import the SCSS file

type Status = "verifying" | "success" | "error";

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<Status>("verifying");
    const [error, setError] = useState<string>("");
    const started = useRef(false); // StrictMode runs effects twice; only confirm once

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const userId = searchParams.get("userId");
        const token = searchParams.get("token");
        if (!userId || !token) {
            setError("This verification link is invalid.");
            setStatus("error");
            return;
        }

        confirmEmail(userId, token)
            .then(() => setStatus("success"))
            .catch((err: any) => {
                const message = typeof err.response?.data === "string" ? err.response.data : "We couldn't verify your email. Please try again.";
                setError(message);
                setStatus("error");
            });
    }, [searchParams]);

    return (
        <div className="user-container">
            <h2>Verify Email</h2>
            {status === "verifying" && <div className="spinner"></div>}
            {status === "success" && (
                <div className="success-container">
                    Your email is verified. You can now <Link to="/user/login">log in</Link>.
                </div>
            )}
            {status === "error" && <div className="error-container">{error}</div>}
        </div>
    );
};

export default VerifyEmail;
