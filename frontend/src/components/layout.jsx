import { createContext, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaSearch, FaSignOutAlt, FaUser } from "react-icons/fa";
import { userInfo, logout } from "../controllers/auth_controller";

// Create Context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

const Layout = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await userInfo();
                setUserInfo(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = "/"; // Redirect to home or login page
    };

    return (
        <UserContext.Provider value={{ userInfo, error, handleLogout }}>
            <div className="w-full h-screen flex flex-col">
                {/* Navigation Bar */}
                <nav className="flex items-center justify-between py-5 border-b-2 border-gray-200 mx-10">
                    {/* Logo */}
                    <p className="fancy-font text-primary text-3xl">Timeframe</p>

                    {/* Navigation Links */}
                    <ul className="flex space-x-6">
                        <li><Link to="/dashboard" className="text-accent font-medium hover:text-compliment">Dashboard</Link></li>
                        <li><Link to="/timetable" className="text-accent font-medium hover:text-compliment">Timetable</Link></li>
                        <li><Link to="/classes" className="text-accent font-medium hover:text-compliment">Classes</Link></li>
                        <li><Link to="/settings" className="text-accent font-medium hover:text-compliment">Settings</Link></li>
                    </ul>

                    {/* User Icon */}
                    <div className="flex items-center space-x-2">
                        {/* <FaSearch size={20} className="text-primary hover:text-secondary cursor-pointer mx-5" /> */}
                        <FaUser size={20} className="text-primary hover:text-secondary cursor-pointer" />
                        {/* {userInfo && <span className="text-gray-800">{userInfo.username}</span>} */}
                        <FaSignOutAlt 
                            size={20} 
                            className="text-primary hover:text-secondary cursor-pointer" 
                            onClick={handleLogout} 
                        />
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </UserContext.Provider>
    );
};

export default Layout;
