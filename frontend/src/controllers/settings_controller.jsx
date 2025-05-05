import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = "http://127.0.0.1:8000/";

// User Queries
export const readUserTitles = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_admin/user_titles/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

// Teachers Queries
export const createTeacher = async (teacherData) => {
    console.log(teacherData);
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
            `${API_URL}tf_admin/teachers/`,
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
        const response = await axios.get(`${API_URL}tf_admin/teachers/`, {
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
        const response = await axios.patch(
            `${API_URL}tf_admin/teachers/${id}/`,
            teacherData, // JSON data being sent
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

export const deleteTeacher = async (id) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.delete(
            `${API_URL}tf_admin/teachers/${id}/`,
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the deleted teacher data
    } catch (error) {
        console.error("Failed to delete teacher", error);
        throw error;
    }
};

// Subjects Queries
export const readSubjects = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_admin/subjects/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};