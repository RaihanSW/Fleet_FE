import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

// UserList Component with Pagination
const UserList = ({ users, currentPage, usersPerPage, paginate }) => {
  const navigate = useNavigate();

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  if (users.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No users found.</p>;
  }

  return (
    <section className="mt-6 bg-white shadow-md rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">No.</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Username</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.uid}
                className="border-t hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/Users/User/Detail/${user.uid}`)}
              >
                <td className="px-6 py-4 text-gray-700 font-medium">{indexOfFirstUser + index + 1}</td>
                <td className="px-6 py-4 text-gray-600">{user.username}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.roles.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 text-white hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastUser >= users.length}
          className={`px-4 py-2 rounded-lg font-semibold ${
            indexOfLastUser >= users.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 text-white hover:bg-gray-300'
          }`}
        >
          Next
        </button>
      </div>
    </section>
  );
};

// Main Component
const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page
  const navigate = useNavigate();
  const { uid } = useParams();

  useEffect(() => {
    if (!uid) {
      fetchUsers();
    } else {
      fetchUserDetail(uid);
    }
  }, [uid]);

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

  const fetchUserDetail = async (uid) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/users/account?uid=${uid}`,
        {
          headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('User Detail:', response.data);
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
    }
  };

  // Filter Users Based on Search
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Pagination
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl space-y-12">
      {/* Title Section */}
      <h2 className="text-4xl font-bold text-gray-800 mb-6">User List</h2>

      {/* Search and Add User Section */}
      <section className="flex text-black items-center justify-between mb-6">
        <div className="w-3/4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <button
          onClick={() => navigate('/Users/User/Detail/:uid')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150 ml-4"
        >
          + Add User
        </button>
      </section>

      {/* Error Message Section */}
      {error && (
        <section className="text-center">
          <p className="text-red-600 bg-red-100 border border-red-300 rounded p-4">{error}</p>
        </section>
      )}

      {/* UserList Section */}
      {!uid ? (
        <UserList users={filteredUsers} currentPage={currentPage} usersPerPage={usersPerPage} paginate={paginate} />
      ) : (
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">User Detail</h3>
          <p>Form for editing the user will go here...</p>
        </section>
      )}
    </div>
  );
};

export default UserPageTest;
