import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// Main Component
const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/menus/web-menu/list`, {
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
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    //   user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        className="text-gray-700 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );

  // UserList Component
  const UserList = ({ webmenus, handleRevokeAccess }) => {
    const totalPages = Math.ceil(webmenus.length / itemsPerPage);

    const paginatedData = webmenus.slice(
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



    if (webmenus.length === 0) {
      return <p className="text-center text-gray-500 mt-4">No webmenus found.</p>;
    }

    return (
      <section className="mt-6 bg-white shadow-md rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">No.</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Parent</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Order</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Slug</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">URL</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((webmenu, index) => (
                <tr
                  key={webmenu.id}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                  onClick={() => navigate(`/Menu/Webmenu/Detail/${webmenu.id}`)}
                >
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {webmenu.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {webmenu.parent_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {webmenu.order_id}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {webmenu.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {webmenu.url}
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
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Webmenu List</h2>

      {/* Search and Add User Section */}
      <section className="flex items-center justify-between mb-6">
        <div className="w-3/4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <button
          onClick={() => navigate('/Menu/Webmenu/Detail/:id')} // Redirect to "Add User" page
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
      <UserList webmenus={filteredUsers} handleRevokeAccess={handleRevokeAccess} />
    </div>
  );
};

export default UserPageTest;
