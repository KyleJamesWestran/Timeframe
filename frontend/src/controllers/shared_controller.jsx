import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = "http://127.0.0.1:8000/";

// User Queries
export const readTitles = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_auth/titles/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const readDays = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_auth/days/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const readGroups = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_auth/groups/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};