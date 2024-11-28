import React, { useState } from "react";
import { login } from "../../services/authService";
import "./user.scss"; // Import the SCSS file

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Track loading state

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(""); // Clear any previous error
        try {
            await login(email, password);
            window.location.href = "/"; // Redirect after login
        } catch (err) {
            setError("Invalid email or password.");
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
        </div>
    );
};

export default Login;
