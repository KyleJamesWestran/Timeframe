import {useUser} from "../components/layout"; // Import useUser from Layout

const AdminDashboard = () => {
    const {userInfo, error} = useUser(); // Get user info from Layout

    return (
        <div>
            <h1 className="font-bold">Dashboard</h1>
        </div>
    );
};

export default AdminDashboard;
