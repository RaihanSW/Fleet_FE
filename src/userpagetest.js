import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/users/account/list`, {
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Adjusting to the nested structure of the API response
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
      await axios.patch(`${process.env.REACT_APP_BACKEND_HOST}/users/account/${userId}/toggle-access`, {}, {
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, is_active: !user.is_active } : user
        )
      );
    } catch (err) {
      console.error('Failed to update user access', err);
      setError('Failed to update user access');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Access List</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <ul className="bg-white shadow-lg rounded-lg overflow-hidden">
        {users.map((user) => (
          <li
            key={user.uid}
            className="border-b last:border-none p-6 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-700">{user.first_name} {user.last_name}</h3>
              <p className="text-gray-500">Role: {user.roles.name}</p>
              <p className={`text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                Access: {user.is_active ? 'Granted' : 'Revoked'}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition duration-150"
              onClick={() => handleRevokeAccess(user.uid)}
            >
              {user.is_active ? 'Revoke Access' : 'Grant Access'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPageTest;
