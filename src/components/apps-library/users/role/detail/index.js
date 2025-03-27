import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Detail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [role,setRole] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    role: '',
    admin: '',
  });

  useEffect(() => {
    if (id && id !== ":id") {

      fetchUserData();
    } else {
      // No valid UID or placeholder ":uid", show an empty form
      setLoading(false); // Immediately set loading to false
    }
  }, [id]);
  
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/users/roles?id=${id}`,
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const roleData = response.data?.express21?.results?.data;
      if (roleData) {
        setFormData({
          id: roleData.id || "",
          role: roleData.name || "",
        });
        setRole(roleData); // Set user data for edit
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data."); // Set error message
    } finally {
      setLoading(false); // Ensure loading is set to false when fetching is complete
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const dataToSend = {
      id: formData.id,
      name: formData.role,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/users/roles`, 
        dataToSend,
        {
          headers: {
            Authorization: `Basic ${token}`, 
            "Content-Type": "application/json", 
          },
        }
      );

      if (response.status === 200) {
        alert(`Data berhasil dikirim: ID: ${formData.id}, Role: ${formData.role}`);
      } else {
        alert(`Gagal mengirim data: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Terjadi kesalahan saat mengirim data.');
    }

    setFormData({
      id: '',
      role: '',
      admin: '',
    });
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      role: '',
      admin: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg bg-white p-6">
        <form onSubmit={handleSubmit}>
          {/* ID Input (disabled) */}
          <div className="mb-4 flex items-center">
            <label
              htmlFor="id"
              className="w-1/4 text-gray-700 font-bold text-right mr-4"
            >
              ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled // This makes the input disabled
              className={`w-3/4 px-4 py-2 border rounded-lg bg-[#DCDFF1] text-black focus:outline-none focus:ring focus:ring-blue-500 ${formData.id ? 'text-black' : 'text-gray-500'}`}
              placeholder="Masukkan ID"
            />
          </div>

          {/* Role Input */}
          <div className="mb-4 flex items-center">
            <label
              htmlFor="role"
              className="w-1/4 text-gray-700 font-bold text-right mr-4"
            >
              Nama Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-3/4 px-4 py-2 border rounded-lg bg-[#DCDFF1] text-black focus:outline-none focus:ring focus:ring-blue-500 ${formData.role ? 'text-black' : 'text-gray-500'}`}
              placeholder="Masukkan Role"
              required
            />
          </div>

          {/* Buttons: Submit and Delete */}
          <div className="mt-6 flex justify-center space-x-4 w-full">
            <button
              type="submit"
              className="bg-[#419854] text-white py-2 px-4 rounded hover:bg-[#357d44] transition duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-[#D43A3A] text-white py-2 px-4 rounded hover:bg-[#a12c2c] transition duration-300"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Detail;