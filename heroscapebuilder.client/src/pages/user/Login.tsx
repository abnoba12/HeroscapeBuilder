import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login, resendConfirmation } from "../../services/authService";
import { portLocalDataToAccount } from "../../services/local-db/port-local-data";
import "./user.scss"; // Import the SCSS file

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const [unconfirmed, setUnconfirmed] = useState<boolean>(false);
    const [resent, setResent] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(""); // Clear any previous error
        try {
            await login(email, password);
            await portLocalDataToAccount(); // Moves anything saved in this browser into the account
            window.location.href = "/"; // Redirect after login
        } catch (err: any) {
            if (err?.response?.status === 403) {
                setUnconfirmed(true);
                setError("Please confirm your email address before logging in. Check your inbox for the confirmation link.");
            } else {
                setUnconfirmed(false);
                setError("Invalid email or password.");
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="user-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading} // Disable input while loading
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Disable input while loading
                />
                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : "Login"}
                </button>

                {/* Display error message */}
                {error && <div className="error-container">{error}</div>}
            </form>
            {unconfirmed && (
                <p>
                    {resent ? "A new confirmation email is on its way." : (
                        <button type="button" className="btn btn-link" onClick={async () => { await resendConfirmation(email); setResent(true); }}>
                            Resend confirmation email
                        </button>
                    )}
                </p>
            )}
            <p><Link to="/user/forgot-password">Forgot your password?</Link></p>
        </div>
    );
};

export default Login;
