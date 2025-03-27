import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";



// Main Component
const UserPageTest = () => {
  const [accessRoles, setAccessRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [formStatus, setFormStatus] = useState(""); // Form status message
  const [isSubmitting, setIsSubmitting] = useState(false); // Submit button state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    fa_tag: "",
    url: "",
    parent_id: "",
    order_id: "",
  });
  
  const { id } = useParams();
  const roles_id = id
  const navigate = useNavigate();

  useEffect(() => {
    // fetchWebMenu();
    if (id && id !== ":id") {
      fetchWebMenuData();
    }
  }, []);

  const fetchWebMenuData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/menus/web-menu?id=${roles_id}`,
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const webmenuData = response.data?.express21?.results?.data;
      if (webmenuData) {
        setFormData({
          id: webmenuData.id || "",
          name: webmenuData.name || "",
          slug: webmenuData.slug || "",
          fa_tag: webmenuData.fa_tag || "",
          url: webmenuData.url || "",
          parent_id: webmenuData.parent_id || "",
          order_id: webmenuData.order_id || "",
        });
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error("Error fetching webmenu data:", err);
      setError("Failed to load webmenu data."); // Set error message
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

  // need refactor
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    setIsSubmitting(true);
    setFormStatus("");
  
    const updatedData = {
      ...formData,
      id: parseInt(formData.id, 10),
      parent_id: parseInt(formData.parent_id, 10),
      order_id: parseInt(formData.order_id, 10),
    };
  
    try {
      let response;
        // Update user if valid UID exists
      response = await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/menus/web-menu`,
        updatedData,
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
  
      const responseData = response.data?.express21?.results?.data;
  
      if (response.status === 200 && responseData) {
        setFormStatus(id && id !== ":id" ? "User updated successfully!" : "User added successfully!");
        if (!id || id === ":id") {
          setFormData({ first_name: "", last_name: "", email: "", roles_id: "" }); // Reset form after add
        }
      } 
      // else {
      //   const errorMessage = response.data?.express21?.error_message || "Unknown error occurred.";
      //   setFormStatus(`Failed to submit data: ${errorMessage}`);
      // }
    } catch (err) {
      const serverError =
        err.response?.data?.express21?.error_message || "An error occurred while submitting the data.";
      console.error("Error submitting data:", err);
      setError(serverError);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCancel = () => {
    setFormData({
      id: '',
      role: '',
      admin: '',
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    setIsSubmitting(true);
    setFormStatus("");
  
    const updatedData = {
      ...formData,
      id: parseInt(formData.id, 10),
      parent_id: parseInt(formData.parent_id, 10),
      order_id: parseInt(formData.order_id, 10),
    };
  
    try {
      let response;
        // Update user if valid UID exists
      response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_HOST}/menus/web-menu`,
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
          data: updatedData,
        }
      );
      
  
      const responseData = response.data?.express21?.results?.data;
  
      if (response.status === 200 && responseData) {
        setFormStatus(id && id !== ":id" ? "User Deleted successfully!" : "User Deleted successfully!");
        if (!id || id === ":id") {
          setFormData({ first_name: "", last_name: "", email: "", roles_id: "" }); // Reset form after add
        }
      } 
      // else {
      //   const errorMessage = response.data?.express21?.error_message || "Unknown error occurred.";
      //   setFormStatus(`Failed to submit data: ${errorMessage}`);
      // }
    } catch (err) {
      const serverError =
        err.response?.data?.express21?.error_message || "An error occurred while Deleting the data.";
      console.error("Error Deleting data:", err);
      setError(serverError);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl space-y-12">
        {/* Title Section */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Webmenu Detail</h2>
    
        <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                Id
                </label>
                <div className="relative">
                {/* <FaUser className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    disabled
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.id}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                />
                </div>
            </div>

            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                Parent Id
                </label>
                <div className="relative">
                {/* <FaUser className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    type="number"
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleChange}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
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
                Name
                </label>
                <div className="relative">
                {/* <FaEnvelope className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                />
                </div>
            </div>

            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                Slug
                </label>
                <div className="relative">
                {/* <FaUser className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                FA tag
                </label>
                <div className="relative">
                {/* <FaUser className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    type="text"
                    name="fa_tag"
                    value={formData.fa_tag}
                    onChange={handleChange}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                />
                </div>
            </div>

            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                URL
                </label>
                <div className="relative">
                {/* <FaUser className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
                <label
                htmlFor="first_name"
                className="block font-semibold text-gray-700 mb-1"
                >
                Order ID
                </label>
                <div className="relative">
                {/* <FaUser className="absolute left-3 top-3 text-gray-400" /> */}
                <input
                    type="number"
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleChange}
                    className="w-3/4 text-gray-600 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                />
                </div>
            </div>

            <div className="flex-1">
              {/* created for balancing left side */}
            </div>
        </div>

        {/* Search and Add User Section */}
        {/* <section className="flex items-center justify-between mb-6">
            <div className="w-3/4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
        </section> */}

        {/* Error Message Section */}
        {error && (
            <section className="text-center">
            <p className="text-red-600 bg-red-100 border border-red-300 rounded p-4">
                {error}
            </p>
            </section>
        )}

        {/* Success Message Section */}
        {formStatus && (
            <section className="text-center">
            <p className="text-green-600 bg-green-100 border border-green-300 rounded p-4">
                {formStatus}
            </p>
            </section>
        )}

        {/* RoleAccessList Section */}
        {/* <RoleAccessList accessRoles={filteredAccessRoles} handleRevokeAccess={handleRevokeAccess} /> */}
        <div className="mt-10 flex justify-center space-x-4 w-full">
          <button
            type="submit"
            className="bg-[#419854] text-white py-2 px-4 rounded hover:bg-[#357d44] transition duration-300"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!formData.id}
            className={`py-2 px-4 rounded text-white transition duration-300 ${
              !formData.id
                ? "bg-gray-400 cursor-not-allowed" // Disabled style
                : "bg-[#D43A3A] hover:bg-[#a12c2c]" // Enabled style
            }`}
          >
            Delete
          </button>
        </div>
    </div>
  );
};

export default UserPageTest;
