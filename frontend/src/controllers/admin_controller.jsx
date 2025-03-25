import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = "http://127.0.0.1:8000/";


// Teachers Queries
export const createTeacher = async (teacherData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
            `${API_URL}ll_admin/teachers/`,
            teacherData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the created teacher data
    } catch (error) {
        console.error("Failed to create teacher", error);
        throw error;
    }
};

export const readTeachers = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}ll_admin/teachers/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const updateTeacher = async (id, teacherData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.put(
            `${API_URL}ll_admin/teachers/${id}/`,
            teacherData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the created teacher data
    } catch (error) {
        console.error("Failed to create teacher", error);
        throw error;
    }
};

// Classes Queries
export const readClasses = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}ll_admin/classes/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

// Subjects Queries
export const readSubjects = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}ll_admin/subjects/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};