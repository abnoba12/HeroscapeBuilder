import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "./user.scss";

const ResetPassword: React.FC = () => {
    const [params] = useSearchParams();
    const email = params.get("email") ?? "";
    const token = params.get("token") ?? "";
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setErrors(["The passwords do not match."]);
            return;
        }
        setLoading(true);
        setErrors([]);
        try {
            await resetPassword(email, token, password);
            setDone(true);
        } catch (err: any) {
            const data = err?.response?.data;
            if (Array.isArray(data)) setErrors(data.map((item: { description: string }) => item.description));
            else setErrors([typeof data === "string" ? data : "Something went wrong. Please try again."]);
        } finally {
            setLoading(false);
        }
    };

    if (!email || !token) {
        return (
            <div className="user-container">
                <h2>Reset Password</h2>
                <p>This reset link is not valid. <Link to="/user/forgot-password">Request a new one.</Link></p>
            </div>
        );
    }

    return (
        <div className="user-container">
            <h2>Reset Password</h2>
            {done ? (
                <p>Your password has been updated. <Link to="/user/login">Log in</Link></p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} autoComplete="new-password" />
                    <input type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required disabled={loading} autoComplete="new-password" />
                    <button type="submit" disabled={loading}>{loading ? <div className="spinner"></div> : "Update password"}</button>
                    {errors.length > 0 && <div className="error-container"><ul>{errors.map(item => <li key={item}>{item}</li>)}</ul></div>}
                </form>
            )}
        </div>
    );
};

export default ResetPassword;
