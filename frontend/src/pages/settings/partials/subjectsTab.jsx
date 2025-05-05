import React, { useState, useEffect } from "react";
import { readSubjects } from "../../../controllers/settings_controller"


const SubjectsTab = () => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await readSubjects();
                setRowData(data);
            } catch (err) {
                console.error("Error fetching subjects:", err);
            }
        };
        fetchSubjects();
    }, []);

    const colDefs = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
    ];

    return (
        <div style={{ width: "100%", height: "100%" }}>

        </div>
    );
};

export default SubjectsTab;
