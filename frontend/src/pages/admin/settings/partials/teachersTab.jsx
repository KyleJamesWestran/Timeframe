import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { readTeachers } from "../../../../controllers/admin_controller"

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TeachersTab = () => {
    const [rowData, setRowData] = useState([]);

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

    const colDefs = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "first_name", headerName: "Name", width: 200 },
        { field: "last_name", headerName: "Surname", width: 200 },
        { field: "email", headerName: "Email", width: 250 }
    ];

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{ flex: 1 }}
                domLayout="autoHeight"
            />
        </div>
    );
};

export default TeachersTab;
