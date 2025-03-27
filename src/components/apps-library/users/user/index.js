import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";



// Main Component
const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    roles_id: "",
  });

  const { uid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessUser();
  }, []);

  const fetchAccessUser = async () => {
    const token = localStorage.getItem('token');

    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/users/auth/account?filter_by_col=account_uid&filter_by_text=${uid}`, {
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

  const handleRevokeAccess = async (user) => {
    const token = localStorage.getItem('token');
    console.log(user)
    const jsondata = {
        "account_uid": user.account_uid,
        "web_menu_id": user.web_menu_id,
        "action_id": user.action_id, // only has 1 action only
      };

    try {
    const response = await axios({
        method: "post",
        url: `http://127.0.0.1:7777/users/auth/account`,
        data: jsondata,  // Use the existing formData   
        headers: { 
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
         },
    });
    window.location.reload();
    } catch (err) {
      console.error('Failed to update user access', err);
      setError('Failed to update user access');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.web_menu_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.action_name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // SearchBar Component
  const SearchBar = ({ searchQuery, setSearchQuery }) => (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
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
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Parent</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Action</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.uid}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {user.web_menu_name} 
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {user.web_menu_parent_id} 
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.action_name}</td>
                  {/* <td
                    className={`px-6 py-4 font-semibold ${
                      user.allow ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {user.allow ? 'Granted' : 'Revoked'}
                  </td> */}
                  <td className="px-6 py-4">
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                        user.allow
                          ? 'bg-green-600 text-white hover:bg-gray-700'
                          : 'bg-gray-600 text-white hover:bg-green-700'
                      } transition-all duration-150`}
                      onClick={() => handleRevokeAccess(user)}
                    >
                      {user.allow ? 'Allowed' : 'Denied'}
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


  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl space-y-12">
        {/* Title Section */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Access User Detail</h2>
    
        <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                First Name
                </label>
                <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your first name"
                />
                </div>
            </div>

            <div className="flex-1">
                <label
                htmlFor="last_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                Last Name
                </label>
                <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your last name"
                    />
                </div>
            </div>
        </div>

            {/* Email and Role */}
        <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
                <label
                htmlFor="email"
                className="block font-semibold text-gray-700 mb-1"
                >
                Email
                </label>
                <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
                </div>
            </div>

            <div className="flex-1">
                <label
                htmlFor="roles_id"
                className="block font-semibold text-gray-700 mb-1"
                >
                Role ID
                </label>
                <div className="relative">
                <FaIdBadge className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="number"
                    id="roles_id"
                    name="roles_id"
                    value={formData.roles_id}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role ID"
                />
                </div>
            </div>
        </div>


        {/* Search and Add User Section */}
        <section className="flex items-center justify-between mb-6">
            <div className="w-3/4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
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
