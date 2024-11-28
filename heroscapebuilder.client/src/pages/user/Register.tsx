import React, { useState } from "react";
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setErrors([]); // Clear any previous errors
        try {
            await register(email, password);
            alert("Registration successful! Please log in.");
            window.location.href = "/user/login"; // Redirect to login page
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
