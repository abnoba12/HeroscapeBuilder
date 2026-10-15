import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import "./user.scss";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await forgotPassword(email);
            setSent(true);
        } catch {
            setError("Something went wrong. Please try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-container">
            <h2>Forgot Password</h2>
            {sent ? (
                <p>If an account exists for {email}, a reset link is on its way. Check your inbox and spam folder.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <p>Enter your email and we will send you a link to choose a new password.</p>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                    <button type="submit" disabled={loading}>{loading ? <div className="spinner"></div> : "Send reset link"}</button>
                    {error && <div className="error-container">{error}</div>}
                </form>
            )}
            <p><Link to="/user/login">Back to login</Link></p>
        </div>
    );
};

export default ForgotPassword;
