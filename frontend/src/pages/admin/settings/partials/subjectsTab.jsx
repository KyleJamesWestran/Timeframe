import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { readSubjects } from "../../../../controllers/admin_controller"

ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{ flex: 1 }}
                domLayout="autoHeight"
            />
        </div>
    );
};

export default SubjectsTab;
