import React, {useState} from "react";
import {Tabs, TabsHeader, TabsBody, Tab, TabPanel} from "@material-tailwind/react";
import {
    FaChalkboardTeacher,
    FaUserGraduate,
    FaBook,
    FaSchool,
    FaBookOpen,
    FaAddressBook,
    FaUser,
    FaChild
} from "react-icons/fa";
import {useUser} from "../../components/layout"; // Import useUser from Layout

// Import the separate pages
import UserTab from "./partials/userTab";
import SchoolTab from "./partials/schoolTab";
import TeachersTab from "./partials/teachersTab";
import StudentsTab from "./partials/studentsTab";
import SubjectsTab from "./partials/subjectsTab";

const SettingsPage = () => {
    const {userInfo, error} = useUser(); // Get user info from Layout
    const [activeTab,
        setActiveTab] = useState("user");

    const tabs = [
        {
            label: "User Details",
            value: "user",
            icon: FaUser,
            component: <UserTab/>
        }, {
            label: "School Details",
            value: "school",
            icon: FaSchool,
            component: <SchoolTab/>
        }, {
            label: "Teachers",
            value: "teachers",
            icon: FaChalkboardTeacher,
            component: <TeachersTab/>
        }, {
            label: "Students",
            value: "students",
            icon: FaChild,
            component: <StudentsTab/>
        }, {
            label: "Subjects",
            value: "Subjects",
            icon: FaAddressBook,
            component: <SubjectsTab/>
        }
    ];

    return (
        <div className="w-full h-full">
            <Tabs value={activeTab} className="w-full h-full">
                <TabsHeader className="bg-gray-100 p-1 mb-2">
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

                <TabsBody className="overflow-y-auto h-[calc(100vh-8rem)] px-2">
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
