import {useState, useEffect} from 'react';
import {userInfo} from '../../../controllers/auth_controller';
import {base64ToImage} from '../../../components/helpers';

const UserTab = () => {
    const [userData,
        setUserData] = useState({
        profile_picture: '',
        user_type: '',
        username: '',
        email: '',
        phone: '',
        class_name: '',
        school_name: ''
    });

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const data = await userInfo();
                const picture = base64ToImage(data.picture);
                setUserData({
                    ...data,
                    picture
                });
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-50">
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-4 mb-10">
                {/* Profile section */}
                <div className="flex items-center gap-6 mb-6">
                    {userData.picture && userData.picture.length > "data:image/png;base64,".length
                        ? (<img
                            src={userData.picture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"/>)
                        : (
                            <div
                                className="w-24 h-24 rounded-full bg-gray-300 text-white flex items-center justify-center text-3xl font-bold border-4 border-gray-300">
                                {(userData.first_name
                                    ?.[0] || '').toUpperCase() + (userData.last_name
                                    ?.[0] || '').toUpperCase()}
                            </div>
                        )}

                    <div>
                        <h2 className="text-2xl font-semibold">{userData.username}</h2>
                        <h3 className="text-l font-semibold">{userData.groups}</h3>
                    </div>
                </div>

                {/* Editable info section */}
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            name="title"
                            value={userData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            name="first_name"
                            value={userData.first_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            name="last_name"
                            value={userData.last_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">School</label>
                        <input
                            name="school_name"
                            value={userData.school_name}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-100"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTab;
