import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = "http://127.0.0.1:8000/";

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/token/`, { username, password });
        
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        return response.data;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const registerSchool = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}auth/register_school/`, userData);

        // Store tokens if registration is successful
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        return response.data;
    } catch (error) {
        console.error("Registration failed", error);
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}auth/get_user_info/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const isAuthenticated = () => {
    const token = getAccessToken();
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch {
        return false;
    }
};

export const refreshToken = async () => {
    try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");

        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
        localStorage.setItem('access_token', response.data.access);
        return response.data.access;
    } catch (error) {
        console.error("Failed to refresh token", error);
        logout();
        throw error;
    }
};
