import React, {useState} from "react";
import * as XLSX from "xlsx";
import {toast} from 'react-hot-toast';
import {FaQuestionCircle, FaFileExcel, FaFilePdf, FaFileUpload} from "react-icons/fa";
import PreviewModal from './Preview.jsx';

const dayNames = [
    {
        label: "SUN",
        value: 0
    }, {
        label: "MON",
        value: 1
    }, {
        label: "TUE",
        value: 2
    }, {
        label: "WED",
        value: 3
    }, {
        label: "THUR",
        value: 4
    }, {
        label: "FRI",
        value: 5
    }, {
        label: "SAT",
        value: 6
    }
];

const settingOptions = [
    {
        key: "enforce_required_lessons",
        label: "Enforce Required Lessons",
        tooltip: "Ensure All lessons are accounted for, based on the required lesson count."
    }, {
        key: "enforce_teacher_no_double_booking",
        label: "Prevent Teacher Double Booking",
        tooltip: "Prevent a teacher from being scheduled for more than one class at the same time."
    }, {
        key: "enforce_one_subject_per_period",
        label: "Prevent Class Double Booking",
        tooltip: "Prevent a class from being scheduled for more than one lesson at a time"
    }
];

const UploadSection = () => {
    const [fileData,
        setFileData] = useState(null);

    const [settings,
        setSettings] = useState({
        days_per_week: [
            1, 2, 3, 4, 5
        ], // Monday to Friday by default
        periods_per_day: 6,
        enforce_required_lessons: true,
        max_subjects_per_day: 1,
        enforce_teacher_no_double_booking: true,
        enforce_one_subject_per_period: true
    });

    const [apiResponse,
        setApiResponse] = useState(null);
    const [isPopupOpen,
        setIsPopupOpen] = useState(false);

    const handleFileUpload = (e) => {
        setApiResponse();
        const file = e.target.files?.[0] || e?.dataTransfer?.files?.[0];

        if (!file) return;

        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = "";

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            toast.error("Only Excel files (.xlsx or .xls) are allowed.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, {type: "array"});
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX
                .utils
                .sheet_to_json(sheet);

            const validationError = validateFile(jsonData);
            if (validationError) {
                toast.error(validationError);
                return;
            }

            const teacherMap = {};
            jsonData.forEach((row) => {
                const teacher = row.Teacher;
                if (!teacherMap[teacher]) {
                    teacherMap[teacher] = [];
                }

                teacherMap[teacher].push({
                    subject: row.Subject,
                    weekly_lessons: parseInt(row.Lessons),
                    class_name: row.Class
                });
            });

            setFileData(teacherMap);
            toast.success("File successfully uploaded.");
        };

        reader.readAsArrayBuffer(file);
    };

    const validateFile = (jsonData) => {
        if (jsonData.length === 0) {
            return "The uploaded file is empty.";
        }

        const requiredColumns = ["Teacher", "Subject", "Lessons", "Class"];
        const firstRow = jsonData[0];
        const actualColumns = Object.keys(firstRow);
        const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

        if (missingColumns.length > 0) {
            return `Missing required column(s): ${missingColumns.join(", ")}`;
        }

        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            const rowNum = i + 2; // +2 to account for header row and 0-index

            for (const col of requiredColumns) {
                if (row[col] === undefined || row[col] === null || row[col].toString().trim() === "") {
                    return `Row ${rowNum}: "${col}" is empty.`;
                }
            }

            // Validate Lessons is a number
            if (isNaN(row.Lessons) || parseInt(row.Lessons) < 0) {
                return `Row ${rowNum}: "Lessons" must be a non-negative number.`;
            }
        }

        return null; // No errors
    };

    const sendToAPI = async() => {
        if (!fileData) {
            toast.error("No data to send. Please upload an Excel file first.");
            return;
        }

        const formattedData = {
            teachers: Object
                .keys(fileData)
                .map((teacher) => ({teacher, assignments: fileData[teacher]})),
            ...settings
        };

        const toastId = toast.loading("Generating timetable...");

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/schedule`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formattedData)
            });

            if (!res.ok) {
                toast.dismiss(toastId);
                if (res.status === 400) {
                    const errorData = await res.json();
                    toast.error(`${errorData.detail || "Bad Request"}`);
                } else {
                    toast.error(`Error ${res.status}: ${res.statusText}`);
                }
                return;
            }

            const result = await res.json();
            setApiResponse(result); // Save API response for preview
            toast.success("Timetable Generated Successfully!", {id: toastId});

            // Clear uploaded file data and reset input
            setFileData(null);
            const fileInput = document.getElementById("fileInput");
            if (fileInput) {
                fileInput.value = "";
            }

        } catch (err) {
            console.error("Error sending to API:", err);
            toast.dismiss(toastId);
            toast.error("Failed to send data. Please try again later.");
        }
    };

    const toggleDay = (dayValue) => {
        setApiResponse();
        setSettings((prev) => {
            const current = prev.days_per_week;
            if (current.includes(dayValue)) {
                return {
                    ...prev,
                    days_per_week: current.filter((d) => d !== dayValue)
                };
            } else {
                return {
                    ...prev,
                    days_per_week: [
                        ...current,
                        dayValue
                    ].sort()
                };
            }
        });
    };

    return (
        <section
            id="upload"
            className="w-screen min-h-screen p-10 flex flex-col md:flex-row md:justify-center md:items-start gap-10">
            {/* Tutorial Section */}
            <div className="w-full md:w-1/2">
                <p className="text-6xl font-bold text-black mb-4 main-font">GET STARTED</p>
                <p className="text-gray-500 mb-4">
                    Download the template Excel spreadsheet to see the required format for uploading
                    data.
                </p>
                <a
                    href="/Timeframe_Example.xlsx"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-rose-500 !text-white rounded-md hover:bg-rose-600 transition">
                    <FaFileExcel/>
                    Download
                </a>

                <p className="text-2xl text-black main-font">INSTRUCTION:</p>

                <ul className="text-gray-500 main-font list-disc list-inside space-y-1 mb-4">
                    <li>Fill in the teacher, subject, grade, and lessons required per week.</li>
                    <li>Ensure the format matches the template.</li>
                    <li>Only Excel files (.xlsx or .xls) are accepted.</li>
                    <li>Adjust the configuration to suit your preferences on the right before uploading.</li>
                    <li>Hit upload, and correct any errors that popup</li>
                    <li>If no errors pop up, a preview button should appear. Press it to view your
                        timetables.</li>
                    <li>You can reset the process by uploading a new file.</li>
                </ul>

                <div
                    className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-rose-500 transition-colors"
                    onClick={() => document.getElementById('fileInput').click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) 
                        handleFileUpload({
                            target: {
                                files: [file]
                            }
                        });
                    }}>
                    <FaFileUpload className="w-12 h-12 text-rose-500 mb-2"/>
                    <p className="text-lg text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400 mt-1">.xlsx or .xls only</p>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"/>
                </div>
            </div>

            {/* Upload Form Section */}
            <div className="w-full md:w-1/2">
                <p className="text-6xl font-bold text-black mb-4 main-font">CONFIGURATION</p>

                {/* Days per Week */}
                <div className="mb-6">
                    <label className="block text-md font-medium text-gray-700 mb-2">Days per Week</label>
                    <div className="grid grid-cols-7 gap-0">
                        {dayNames.map(({label, value}) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => toggleDay(value)}
                                className={`w-full text-sm border border-gray-300 transition-all !rounded-none ${settings
                                .days_per_week
                                .includes(value)
                                ? "!bg-rose-500 !text-white hover:!bg-rose-600"
                                : "!bg-gray-200 !text-gray-400 hover:!bg-gray-300"}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Periods Per Day */}
                <div className="mb-6">
                    <label className="block text-md font-medium text-gray-700 mb-2">Periods per Day</label>
                    <input
                        type="number"
                        min="1"
                        value={settings.periods_per_day}
                        onChange={(e) => {
                        setSettings({
                            ...settings,
                            periods_per_day: parseInt(e.target.value)
                        });
                        setApiResponse();
                    }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"/>
                </div>

                {/* Max Subjects Per Day */}
                <div className="mb-6">
                    <label className="block text-md font-medium text-gray-700 mb-2">Max Subject Repeats per Day</label>
                    <input
                        type="number"
                        min="1"
                        value={settings.max_subjects_per_day}
                        onChange={(e) => {
                        setSettings({
                            ...settings,
                            max_subjects_per_day: parseInt(e.target.value)
                        });
                        setApiResponse();
                    }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"/>
                </div>

                {/* Toggles */}
                <div className="space-y-4 mb-6">
                    {settingOptions.map(({key, label, tooltip}) => (
                        <div key={key} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FaQuestionCircle
                                    className="text-gray-400 hover:text-rose-500 cursor-pointer"
                                    title={tooltip}
                                    size={16}/>
                                <label className="font-medium text-gray-700">{label}</label>
                            </div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings[key]}
                                    onChange={() => {
                                    setSettings((prev) => ({
                                        ...prev,
                                        [key]: !prev[key]
                                    }));
                                    setApiResponse();
                                }}
                                    className="sr-only"/>
                                <div
                                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings[key]
                                    ? "bg-rose-500"
                                    : "bg-gray-300"}`}>
                                    <div
                                        className={`bg-white w-4 h-4 rounded-full transform duration-300 ease-in-out ${settings[key]
                                        ? "translate-x-5"
                                        : ""}`}></div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        onClick={sendToAPI}
                        className={`flex items-center gap-2 px-6 py-3 me-2 rounded-lg text-white font-semibold transition-colors duration-300 ${fileData
                        ? "!bg-rose-500 hover:!bg-rose-600"
                        : "!bg-gray-300 !cursor-not-allowed"}`}
                        disabled={!fileData}>
                        <FaFileUpload/>
                        Generate
                    </button>
                    {/* New Button: Show Preview, visible only after success */}
                    {apiResponse && (
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-3 !bg-rose-500 !text-white rounded-md hover:!bg-rose-600 transition">
                            <FaFilePdf/>
                            Preview
                        </button>
                    )}
                </div>

                {/* Popup modal */}
                <PreviewModal
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    data={apiResponse}/>
            </div>
        </section>
    )
};

export default UploadSection;
