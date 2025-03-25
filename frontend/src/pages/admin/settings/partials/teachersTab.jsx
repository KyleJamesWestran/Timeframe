import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaUser } from "react-icons/fa";
import { readTeachers, createTeacher, updateTeacher } from "../../../../controllers/admin_controller";
import { convertImageToBase64 } from "../../../../components/helpers";
import {
    ClientSideRowModelModule,
    ModuleRegistry,
} from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TeachersTab = () => {
    const [rowData, setRowData] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await readTeachers();
                setRowData(data);
            } catch (err) {
                console.error("Error fetching teachers:", err);
            }
        };
        fetchTeachers();
    }, []);

    // Handle image upload
    const handleImageClick = (teacherId) => {
        setSelectedTeacherId(teacherId);
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Ensure the input exists before clicking
        }
    };

    const handleImageChange = async (event) => {
        if (!selectedTeacherId) return;

        const file = event.target.files[0];
        if (file) {
            const base64String = await convertImageToBase64(file);
            
            // Update the specific teacher in the state
            setRowData((prev) =>
                prev.map((row) =>
                    row.id === selectedTeacherId ? { ...row, picture: base64String } : row
                )
            );

            // Send the update to the backend
            try {
                await updateTeacher(selectedTeacherId, { picture: base64String });
                console.log("Profile picture updated successfully!");
            } catch (error) {
                console.error("Error updating teacher's profile picture:", error);
            }
        }
    };

    const columnDefs = [
        { field: "id", headerName: "ID", editable: false },
        { field: "username", headerName: "Username", editable: false },
        { field: "title", headerName: "Title", editable: true },
        { field: "first_name", headerName: "First Name", editable: true },
        { field: "last_name", headerName: "Last Name", editable: true },
        { field: "email", headerName: "Email", editable: true },
        { field: "phone", headerName: "Phone", editable: true },
        {
            field: "picture",
            headerName: "Profile Picture",
            editable: false,
            cellRenderer: (params) => {
                return params.value ? (
                    <img
                        src={params.value}
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}
                        onClick={() => handleImageClick(params.data.id)}
                    />
                ) : (
                    <FaUser 
                        size={20} 
                        className="text-primary hover:text-secondary cursor-pointer" 
                        onClick={() => handleImageClick(params.data.id)}
                    />
                );
            },
        },
    ];

    return (
        <div className="w-full h-full">
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
            />

            <button onClick={handleImageClick} className="mb-2 px-4 py-2 bg-blue-500 text-white rounded">
                Add Teacher
            </button>

            <div className="ag-theme-alpine w-full" style={{ height: "500px" }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        flex: 1,
                        editable: true,
                        resizable: true,
                        sortable: true,
                    }}
                    domLayout="autoHeight"
                    editType="fullRow"
                />
            </div>
        </div>
    );
};

export default TeachersTab;
