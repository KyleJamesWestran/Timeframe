import React, {useState} from "react";
import {Tabs, TabsHeader, TabsBody, Tab, TabPanel} from "@material-tailwind/react";
import {FaChalkboardTeacher, FaBook, FaUserGraduate, FaSchool } from "react-icons/fa";
import {useUser} from "../../../components/layout"; // Import useUser from Layout

// Import the separate pages
import TeachersTab from "./partials/teachersTab";
import ClassesTab from "./partials/classesTab";
import StudentsTab from "./partials/studentsTab";
import SchoolTab from "./partials/schoolTab";

const SettingsPage = () => {
    const {userInfo, error} = useUser(); // Get user info from Layout
    const [activeTab,
        setActiveTab] = useState("teachers");

    const tabs = [
        {
            label: "Teachers",
            value: "teachers",
            icon: FaChalkboardTeacher,
            component: <TeachersTab/>
        }, {
            label: "Classes",
            value: "classes",
            icon: FaBook,
            component: <ClassesTab/>
        }, {
            label: "Students",
            value: "students",
            icon: FaUserGraduate,
            component: <StudentsTab/>
        }, {
            label: "School",
            value: "school",
            icon: FaSchool,
            component: <StudentsTab/>
        }
    ];

    return (
        <div>
            <Tabs value={activeTab}>
                <TabsHeader className="bg-gray-100">
                    {tabs.map(({label, value, icon}) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                            className={`${activeTab === value
                            ? "bg-white"
                            : "bg-gray-100"} px-4 py-2 rounded-lg`}>
                            <div className="flex items-center gap-2">
                                {React.createElement(icon, {className: "w-5 h-5"})}
                                {label}
                            </div>
                        </Tab>
                    ))}
                </TabsHeader>

                <TabsBody>
                    {tabs.map(({value, component}) => (
                        <TabPanel key={value} value={value}>
                            {activeTab === value && component}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
