import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../services/authService";
import "./user.scss"; // Import the SCSS file

interface ApiError {
    code: string;
    description: string;
}

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<ApiError[]>([]); // To store API errors
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [registered, setRegistered] = useState<boolean>(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrors([{ code: "PasswordMismatch", description: "The passwords do not match." }]);
            return;
        }
        setLoading(true); // Start loading
        setErrors([]); // Clear any previous errors
        try {
            await register(email, password);
            setRegistered(true);
        } catch (err: any) {
            if (err.response && err.response.data) {
                setErrors(err.response.data); // Set API errors
            } else {
                setErrors([{ code: "UnknownError", description: "An unknown error occurred." }]);
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (registered) {
        return (
            <div className="user-container">
                <h2>Check your email</h2>
                <p>We sent a confirmation link to {email}. Click it to finish creating your account, then <Link to="/user/login">log in</Link>.</p>
            </div>
        );
    }

    return (
        <div className="user-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                />
                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : "Register"}
                </button>
            </form>

            {/* Display error messages */}
            {errors.length > 0 && (
                <div className="error-container">
                    <ul>
                        {errors.map((error) => (
                            <li key={error.code}>{error.description}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Register;
