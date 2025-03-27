import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate dari react-router-dom

// SearchBar Component
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="flex items-center space-x-4">
    <input
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
);


const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Inisialisasi navigate

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/users/roles/list`, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const usersData = response.data?.express21?.results?.data;
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        throw new Error('Unexpected data format from API');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    }
  };

  // Mengubah handleAddClick untuk menggunakan navigate
  const handleAddClick = () => {
    navigate('/Users/Role/Detail/uid');  // Mengarahkan ke halaman detail.js
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-5">
      <h2 className="text-3xl font-bold text-black mb-6">Role</h2>
      <section className="flex text-black items-center justify-between mb-6">
        <div className="w-3/4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150 ml-4"
          onClick={handleAddClick}
        >
          + Add User
        </button>
      </section>
        
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Table Structure */}
      <table className="table-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="px-4 py-2 text-center">No</th>
            <th className="px-4 py-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((role, index) => (
              <tr key={role.id} className="border-t text-black"
              onClick={() => navigate(`/Users/Role/Detail/${role.id}`)}>
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-left">{role.name}</td> {/* Role */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-4 text-gray-600">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserPageTest;
