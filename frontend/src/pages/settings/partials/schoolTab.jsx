import { useState, useEffect, useRef } from 'react';
import { readSchool, updateSchool } from '../../../controllers/auth_controller.jsx';
import { readDays } from '../../../controllers/settings_controller.jsx';
import { base64ToImage, imageToBase64 } from '../../../components/helpers';
import toast from 'react-hot-toast';

const SchoolTab = () => {
  const [schoolData, setSchoolData] = useState({});
  const [daysOptions, setDaysOptions] = useState([]);
  const [dirtyFields, setDirtyFields] = useState({});
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolRes, daysRes] = await Promise.all([readSchool(), readDays()]);

        // Treat schoolRes as an object, NOT array
        if (schoolRes && typeof schoolRes === 'object') {
          const crestImage = schoolRes.crest ? base64ToImage(schoolRes.crest) : '';
          setSchoolData({ ...schoolRes, crest: crestImage });
          console.log("Loaded school data:", { ...schoolRes, crest: crestImage });
        }

        setDaysOptions(daysRes);
      } catch (error) {
        console.error("Error fetching school or days:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'days') {
      let newDays = Array.isArray(schoolData.days) ? [...schoolData.days] : [];
      const dayKey = parseInt(value);

      if (checked) {
        if (!newDays.includes(dayKey)) newDays.push(dayKey);
      } else {
        newDays = newDays.filter((d) => d !== dayKey);
      }
      setSchoolData((prev) => ({ ...prev, days: newDays }));
      setDirtyFields((prev) => ({ ...prev, days: true }));
    } else if (type === 'checkbox') {
      setSchoolData((prev) => ({ ...prev, [name]: checked }));
      setDirtyFields((prev) => ({ ...prev, [name]: true }));
    } else if (type === 'number') {
      setSchoolData((prev) => ({ ...prev, [name]: Number(value) }));
      setDirtyFields((prev) => ({ ...prev, [name]: true }));
    } else {
      setSchoolData((prev) => ({ ...prev, [name]: value }));
      setDirtyFields((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSave = async () => {
    const updatedData = {};
    Object.keys(dirtyFields).forEach((key) => {
      if (key === 'crest' && schoolData.crest) {
        updatedData[key] = schoolData.crest.startsWith('data:')
          ? schoolData.crest.split(',')[1]
          : schoolData.crest;
      } else {
        updatedData[key] = schoolData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast('No changes made', { icon: 'ℹ️' });
      return;
    }

    try {
      await updateSchool(schoolData.id, updatedData);
      toast.success("School updated");
      setDirtyFields({});
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error("Failed to update school");
    }
  };

  const handleCrestClick = () => {
    fileInputRef.current.click();
  };

  const handleCrestChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await imageToBase64(file);
    setSchoolData((prev) => ({
      ...prev,
      crest: base64ToImage(base64)
    }));
    setDirtyFields((prev) => ({ ...prev, crest: true }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">School Details</h2>

        {/* Crest */}
        <div className="mb-8 flex items-center gap-6">
          <div
            onClick={handleCrestClick}
            className="cursor-pointer relative w-28 h-28 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center"
          >
            {schoolData.crest ? (
              <img src={schoolData.crest} alt="School Crest" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400">No Crest</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleCrestChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-gray-600">Click crest to upload</p>
          </div>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'School Name', name: 'name' },
            { label: 'Phone', name: 'phone' },
            { label: 'Email', name: 'email' },
            { label: 'Motto', name: 'motto' },
            { label: 'Street', name: 'street' },
            { label: 'Suburb', name: 'suburb' },
            { label: 'City', name: 'city' },
            { label: 'Country', name: 'country' },
            { label: 'Postal Code', name: 'postal_code' },
            { label: 'Number of Lessons', name: 'lessons', type: 'number' }
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <input
                type={type || 'text'}
                name={name}
                value={schoolData[name] !== undefined && schoolData[name] !== null ? schoolData[name] : ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">School Days</label>
            <div className="flex flex-wrap gap-4">
              {daysOptions.map(({ key, label }) => (
                <label key={key} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="days"
                    value={key}
                    checked={Array.isArray(schoolData.days) && schoolData.days.includes(key)}
                    onChange={handleInputChange}
                    className="h-5 w-5"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SchoolTab;
