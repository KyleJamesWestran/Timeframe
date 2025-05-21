import {useState, useEffect, useRef} from 'react';
import {readUser, updateUser, readSchool} from '../../../controllers/auth_controller';
import {readGroups} from '../../../se'
import {base64ToImage, imageToBase64} from '../../../components/helpers';
import toast from 'react-hot-toast';

const UserTab = () => {
    const [userData,
        setUserData] = useState({});
    const [dirtyFields,
        setDirtyFields] = useState({});
    const fileInputRef = useRef();

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const [user,
                    school] = await Promise.all([readUser(), readSchool()]);

                setUserData({
                    ...user,
                    picture: user.picture
                        ? base64ToImage(user.picture)
                        : '',
                    school: school.name || '' // Or adapt this depending on your school API response
                });
            } catch (error) {
                console.error("Error fetching user or school:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = e => {
        const {name, value} = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
        setDirtyFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleSave = async() => {
        const updatedData = {};
        Object
            .keys(dirtyFields)
            .forEach(key => {
                updatedData[key] = userData[key];
            });

        if (Object.keys(updatedData).length === 0) {
            toast('No changes made', {icon: 'ℹ️'});
            return;
        }

        try {
            // Pass the user ID and the partial object
            await updateUser(userData.id, updatedData);
            toast.success("Profile updated");
            setDirtyFields({});
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update profile");
        }
    };

    const handlePictureClick = () => {
        fileInputRef
            .current
            .click();
    };

    const handlePictureChange = async e => {
        const file = e.target.files[0];
        if (!file) 
            return;
        
        const base64 = await imageToBase64(file);
        const imgSrc = base64ToImage(base64);
        setUserData(prev => ({
            ...prev,
            picture: imgSrc
        }));
        setDirtyFields(prev => ({
            ...prev,
            picture: true
        }));

        // Immediately PATCH only the picture field
        try {
            await updateUser(userData.id, {picture: base64});
            toast.success("Picture updated");
            setDirtyFields(prev => {
                const {
                    picture,
                    ...rest
                } = prev;
                return rest;
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update picture");
        }
    };

    // Password handlers omitted for brevity...

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">

                {/* Profile Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div onClick={handlePictureClick} className="cursor-pointer relative">
                        {userData.picture
                            ? <img
                                    src={userData.picture}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-300"/>
                            : <div
                                className="w-28 h-28 rounded-full bg-gray-300 text-white flex items-center justify-center text-4xl font-bold border-4 border-gray-300">
                                {(userData.first_name
                                    ?.[0] || '').toUpperCase() + (userData.last_name
                                    ?.[0] || '').toUpperCase()}
                            </div>
}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handlePictureChange}
                            className="hidden"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{userData.username}</h2>
                        <p className="text-gray-600">{userData.groups
                                ?.join(', ')}</p>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                        {
                            label: 'Title',
                            name: 'title'
                        }, {
                            label: 'First Name',
                            name: 'first_name'
                        }, {
                            label: 'Last Name',
                            name: 'last_name'
                        }, {
                            label: 'Email',
                            name: 'email'
                        }, {
                            label: 'Phone',
                            name: 'phone'
                        }
                    ].map(({label, name}) => (
                        <div key={name}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <input
                                name={name}
                                value={userData[name] || ''}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"/>
                        </div>
                    ))}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">School</label>
                        <input
                            value={userData.school || ''}
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2"/>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200">
                    Save Changes
                </button>

                {/* Password Section (unchanged) */}
            </div>
        </div>
    );
};

export default UserTab;
