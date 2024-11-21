import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Define the shape of your JWT payload
interface JwtPayload {
    sub: string; // Subject (typically user ID or email)
    exp: number; // Expiration time (epoch in seconds)
    roles?: string[]; // Array of roles (optional)
    [key: string]: any; // Any additional fields
}

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const API_URL = `${API_BASE_URL}/auth`;

// Register a new user
export const register = async (email: string, password: string): Promise<void> => {
    await axios.post(`${API_URL}/register`, { email, password });
};

// Log in and get a JWT token
export const login = async (email: string, password: string): Promise<void> => {
    const response = await axios.post<{ token: string }>(`${API_URL}/login`, { email, password });
    saveToken(response.data.token);
};

// Save the JWT token in localStorage
export const saveToken = (token: string): void => {
    localStorage.setItem("jwt", token);
};

// Retrieve the JWT token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem("jwt");
};

// Decode the token to get user information
export const getUser = (): JwtPayload | null => {
    const token = getToken();
    if (token) {
        return jwtDecode<JwtPayload>(token);
    }
    return null;
};

// Log out the user
export const logout = (): void => {
    localStorage.removeItem("jwt");
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() < exp * 1000;
};

export const hasRole = (role: string): boolean => {
    const user = getUser();
    if (!user || !user.roles) return false;

    return user.roles.includes(role);
};
