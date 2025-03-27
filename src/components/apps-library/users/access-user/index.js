import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// SearchBar Component
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <input
    type="text"
    placeholder="Search by name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
);

// UserList Component
const UserList = ({ users, handleRevokeAccess }) => {
  if (users.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No users found.</p>;
  }

  return (
    <section className="mt-6 bg-white shadow-md rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Role</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Access</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.uid}
                className="border-t hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.roles.name}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    user.is_active ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user.is_active ? 'Granted' : 'Revoked'}
                </td>
                <td className="px-6 py-4">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      user.is_active
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } transition-all duration-150`}
                    onClick={() => handleRevokeAccess(user.uid)}
                  >
                    {user.is_active ? 'Revoke Access' : 'Grant Access'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// Main Component
const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/users/account/list`, {
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

  const handleRevokeAccess = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_HOST}/users/account/${userId}/toggle-access`, {}, {
        headers: {
          Authorization: `Basic ${token}`,
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

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl space-y-12">
      {/* Title Section */}
      <h2 className="text-4xl font-bold text-gray-800 mb-6">User List Management</h2>

      {/* Search and Add User Section */}
      <section className="flex items-center justify-between">
        <div className="w-3/4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <button
          onClick={() => navigate('/add-user')} // Redirect to "Add User" page
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150 ml-4"
        >
          + Add User
        </button>
      </section>

      {/* Error Message Section */}
      {error && (
        <section className="text-center">
          <p className="text-red-600 bg-red-100 border border-red-300 rounded p-4">
            {error}
          </p>
        </section>
      )}

      {/* UserList Section */}
      <UserList users={filteredUsers} handleRevokeAccess={handleRevokeAccess} />
    </div>
  );
};

export default UserPageTest;
