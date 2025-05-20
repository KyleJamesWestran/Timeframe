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

export const createUser = async (userData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(`${API_URL}tf_auth/user/`, 
            userData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const readUser = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_auth/user/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data[0];
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.patch(
            `${API_URL}tf_auth/user/${id}/`,
            userData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the update teacher data
    } catch (error) {
        console.error("Failed to update teacher", error);
        throw error;
    }
};

export const createSchool = async (schoolData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(`${API_URL}tf_auth/school/`, 
            schoolData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const readSchool = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_auth/school/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data[0];
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const updateSchool = async (id, schoolData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.patch(
            `${API_URL}tf_auth/school/${id}/`,
            schoolData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the update teacher data
    } catch (error) {
        console.error("Failed to update teacher", error);
        throw error;
    }
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const isAuthenticated = async () => {
    let token = getAccessToken();
    if (!token) {
        logout();
        return false;
    }

    try {
        let decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
            return true; // Token is still valid
        }

        // Token expired → try refreshing
        token = await refreshToken();
        if (!token) {
            logout();
            return false;
        }

        decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch (error) {
        console.error("Authentication check failed:", error);
        logout();
        return false;
    }
};

export const refreshToken = async () => {
    try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");

        const response = await axios.post(`${API_URL}token/refresh/`, { refresh });

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } else {
            throw new Error("Failed to get new access token");
        }
    } catch (error) {
        console.error("Failed to refresh token:", error.response?.data || error.message);
        logout(); // Clear tokens if refresh fails
        return null;
    }
};

