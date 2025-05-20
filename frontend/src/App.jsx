import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Landing from "./pages/landing";
import Register from "./pages/auth/register";
import AdminDashboard from "./pages/dashboard";
import SettingsPage from "./pages/settings/index";
import Login from "./pages/auth/login";
import PrivateRoute from "./components/privateRoute";
import Layout from "./components/layout";
import { Toaster } from "react-hot-toast";
import "./App.css";
import TimetablePage from "./pages/timetable";

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(mediaQuery.matches);
        document.documentElement.classList.toggle("dark", mediaQuery.matches);

        const onChange = (e) => {
            setIsDarkMode(e.matches);
            document.documentElement.classList.toggle("dark", e.matches);
        };

        mediaQuery.addEventListener("change", onChange);
        return () => mediaQuery.removeEventListener("change", onChange);
    }, []);

    return (
        <div className={`App ${isDarkMode ? "dark" : ""}`}>
            <Toaster position="bottom-center" reverseOrder={false} />
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Layout><AdminDashboard /></Layout>}/>
                        <Route path="/settings" element={<Layout><SettingsPage /></Layout>}/>
                        <Route path="/timetable" element={<Layout><TimetablePage /></Layout>}/>
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
