import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../controllers/auth_controller";

const PrivateRoute = () => {
    const [auth, setAuth] = useState(null); // null = loading, true/false = known

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setAuth(result);
        };
        checkAuth();
    }, []);

    if (auth === null) return <div>Loading...</div>; // or spinner

    return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
