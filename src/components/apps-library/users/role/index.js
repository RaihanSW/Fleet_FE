import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

      // Adjusting to the structure of the API response
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

  const handleRevokeAccess = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      // Dummy PATCH request for toggling access (update as necessary)
      await axios.patch(`${process.env.REACT_APP_BACKEND_HOST}/users/account/${userId}/toggle-access`, {}, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: !user.is_active } : user
        )
      );
    } catch (err) {
      console.error('Failed to update user access', err);
      setError('Failed to update user access');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Roles List</h2>
        <button
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition duration-150"
          onClick={() => navigate('/add-user')}
        >
          + Add User
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <ul className="bg-white shadow-lg rounded-lg overflow-hidden">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="border-b last:border-none p-6 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-700">{user.name}</h3>
              <p className={`text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                Access: {user.is_active ? 'Granted' : 'Revoked'}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition duration-150"
              onClick={() => handleRevokeAccess(user.id)}
            >
              {user.is_active ? 'Revoke Access' : 'Grant Access'}
            </button>
          </li>
        ))}
      </ul>
      {filteredUsers.length === 0 && !error && (
        <p className="text-center text-gray-600 mt-6">No users found.</p>
      )}
    </div>
  );
};

export default UserPageTest;
