import React, { useState } from "react";
import { login, resendVerification } from "../../services/authService";
import "./user.scss"; // Import the SCSS file

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const [unverified, setUnverified] = useState<boolean>(false); // Password was right but the email isn't verified yet
    const [resending, setResending] = useState<boolean>(false);
    const [resent, setResent] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(""); // Clear any previous error
        setUnverified(false);
        setResent(false);
        try {
            await login(email, password);
            window.location.href = "/"; // Redirect after login
        } catch (err: any) {
            if (err.response?.status === 403 && err.response.data?.code === "EmailNotConfirmed") {
                setUnverified(true);
                setError("Please verify your email address before logging in. Check your inbox for the verification link.");
            } else {
                setError("Invalid email or password.");
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await resendVerification(email);
            setResent(true);
        } catch {
            setError("We couldn't send the verification email. Please try again later.");
        } finally {
            setResending(false);
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
                {error && (
                    <div className="error-container">
                        {error}
                        {unverified && !resent && (
                            <div>
                                <button type="button" className="link-button" onClick={handleResend} disabled={resending}>
                                    {resending ? "Sending..." : "Resend verification email"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {resent && <div className="success-container">A new verification link is on its way to {email}.</div>}
            </form>
        </div>
    );
};

export default Login;
