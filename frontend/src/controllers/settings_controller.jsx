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
export const createSubject = async (subjectData) => {
    console.log(subjectData);
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
            `${API_URL}tf_admin/subjects/`,
            subjectData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the created subject data
    } catch (error) {
        console.error("Failed to create subject", error);
        throw error;
    }
};

export const readSubjects = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_admin/subjects/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get subject info", error);
        throw error;
    }
};

export const updateSubject = async (id, subjectData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.patch(
            `${API_URL}tf_admin/subjects/${id}/`,
            subjectData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the update subject data
    } catch (error) {
        console.error("Failed to update subject", error);
        throw error;
    }
};

export const deleteSubject = async (id) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.delete(
            `${API_URL}tf_admin/subjects/${id}/`,
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the deleted subject data
    } catch (error) {
        console.error("Failed to delete subject", error);
        throw error;
    }
};

// students Queries
export const createStudent = async (studentData) => {
    console.log(studentData);
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
            `${API_URL}tf_admin/students/`,
            studentData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the created student data
    } catch (error) {
        console.error("Failed to create student", error);
        throw error;
    }
};

export const readStudents = async () => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}tf_admin/students/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get user info", error);
        throw error;
    }
};

export const updateStudent = async (id, studentData) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.patch(
            `${API_URL}tf_admin/students/${id}/`,
            studentData, // JSON data being sent
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the update student data
    } catch (error) {
        console.error("Failed to update student", error);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.delete(
            `${API_URL}tf_admin/students/${id}/`,
            {
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data; // Return the deleted student data
    } catch (error) {
        console.error("Failed to delete student", error);
        throw error;
    }
};