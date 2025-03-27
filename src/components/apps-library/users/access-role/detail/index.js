import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";



// Main Component
const UserPageTest = () => {
  const [accessRoles, setAccessRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });
  
  const { id } = useParams();
  const roles_id = id
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessRole();
    fetchRolerData();
  }, []);

  const fetchRolerData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/users/roles?id=${roles_id}`,
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rolesData = response.data?.express21?.results?.data;
      if (rolesData) {
        setFormData({
          id: rolesData.id || "",
          name: rolesData.name || "",
        });
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


  const fetchAccessRole = async () => {
    const token = localStorage.getItem('token');

    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/users/auth/roles?filter_by_col=roles_id&filter_by_text=${roles_id}`, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const usersData = response.data?.express21?.results?.data;
      if (Array.isArray(usersData)) {
        setAccessRoles(usersData);
      } else {
        throw new Error('Unexpected data format from API');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    }
  };

  const handleRevokeAccess = async (role) => {
    const token = localStorage.getItem('token');
    console.log(role)
    const jsondata = {
        "roles_id": role.roles_id,
        "web_menu_id": role.web_menu_id,
        "action_id": role.action_id, // only has 1 action only
      };

    try {
    const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_HOST}/users/auth/roles`,
        data: jsondata,  // Use the existing formData   
        headers: { 
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
         },
    });
    window.location.reload();
    } catch (err) {
      console.error('Failed to update access role', err);
      setError('Failed to update access role');
    }
  };

  const filteredAccessRoles = accessRoles.filter(
    (accessRole) =>
      accessRole.web_menu_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accessRole.action_name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // SearchBar Component
  const SearchBar = ({ searchQuery, setSearchQuery }) => (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        ref={inputRef}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="w-full text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );

  // UserList Component
  const RoleAccessList = ({ accessRoles, handleRevokeAccess }) => {
    const totalPages = Math.ceil(accessRoles.length / itemsPerPage);

    const paginatedData = accessRoles.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    // Navigate to the next page
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };


    if (accessRoles.length === 0) {
      return <p className="text-center text-gray-500 mt-4">No Access Role found.</p>;
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
              {paginatedData.map((accessrole) => (
                <tr
                  key={accessrole.uid}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {accessrole.web_menu_name} 
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {accessrole.web_menu_parent_id} 
                  </td>
                  <td className="px-6 py-4 text-gray-600">{accessrole.action_name}</td>
                  {/* <td
                    className={`px-6 py-4 font-semibold ${
                      accessrole.allow ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {accessrole.allow ? 'Granted' : 'Revoked'}
                  </td> */}
                  <td className="px-6 py-4">
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                        accessrole.allow
                          ? 'bg-green-600 text-white hover:bg-gray-700'
                          : 'bg-gray-600 text-white hover:bg-green-700'
                      } transition-all duration-150`}
                      onClick={() => handleRevokeAccess(accessrole)}
                    >
                      {accessrole.allow ? 'Allowed' : 'Denied'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"
            }`}
          >
            Previous
          </button>
          <p className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      </section>
    );
  };


  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl space-y-12">
        {/* Title Section */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Access Role Detail</h2>
    
        <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                Id
                </label>
                <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.id}
                    className="w-1/2 text-gray-600 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your first name"
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
                Role
                </label>
                <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.name}
                    className="w-1/2 text-gray-600 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
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

        {/* RoleAccessList Section */}
        <RoleAccessList accessRoles={filteredAccessRoles} handleRevokeAccess={handleRevokeAccess} />
    </div>
  );
};

export default UserPageTest;
