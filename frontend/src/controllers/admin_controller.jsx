import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = "http://127.0.0.1:8000/";

export const readTeachers = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}auth/teachers/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};