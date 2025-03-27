import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const Dashboard = () => {
  const { uid } = useParams(); // Extract UID from URL
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    roles_id: "",
  });

  const [user, setUser] = useState(null); // User state for additional details like username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // State to track if user is deleted

  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Fetch user data if UID exists
  useEffect(() => {
    if (!uid) {
      setLoading(false); // If no UID (new user), no need to fetch data
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/users/account?uid=${uid}`,
          {
            headers: {
              Authorization: `Basic ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const userData = response.data?.express21?.results?.data;
        if (userData) {
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            roles_id: userData.roles_id || "",
          });
          setUser(userData);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setFormData({ first_name: "", last_name: "", email: "", roles_id: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid, isDeleted]); // Reset on deletion

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (Updating or Adding user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setIsSubmitting(true);
    setFormStatus("");

    const updatedData = {
      ...formData,
    };

    try {
      let response;
      if (uid) {
        // If UID exists, update existing user
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/users/account`, // Use POST for update
          { ...updatedData, uid }, // Include the UID in the request body
          {
            headers: {
              Authorization: `Basic ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // If no UID, add a new user
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/users/account`, // Use POST for adding
          updatedData,
          {
            headers: {
              Authorization: `Basic ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 200) {
        setFormStatus(uid ? "User updated successfully!" : "User added successfully!");
        if (!uid) {
          setFormData({ first_name: "", last_name: "", email: "", roles_id: "" }); // Reset form after adding
        }
      } else {
        setFormStatus(`Failed to submit data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error submitting data:", err);
      setFormStatus("An error occurred while submitting the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deletion of user
  const handleDelete = async (uid) => {
    const token = localStorage.getItem("token");

    try {
      setIsSubmitting(true);

      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_HOST}/users/account`, // API endpoint for deletion
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
          data: { uid },
        }
      );

      if (response.status === 200) {
        setFormStatus("User deleted successfully!");
        setIsDeleted(true); // Mark as deleted
        setFormData({ first_name: "", last_name: "", email: "", roles_id: "" }); // Clear form data
        setTimeout(() => {
          navigate("/users"); // Redirect to user list page using navigate
        }, 500);
      } else {
        setFormStatus(`Failed to delete user: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setFormStatus("An error occurred while deleting the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          {uid ? `Edit User - ${user?.username}` : "Add New User"}
        </h1>

        {/* Error Handling */}
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First and Last Name */}
            <div className="flex justify-between items-center space-x-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Email and Role */}
            <div className="flex justify-between items-center space-x-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">
                  Role ID
                </label>
                <div className="relative">
                  <FaIdBadge className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="roles_id"
                    value={formData.roles_id}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter role ID"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
                ) : (
                  uid ? "Update User" : "Add User"
                )}
              </button>
              {uid && (
                <button
                  onClick={() => handleDelete(user?.uid)}
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
                  ) : (
                    "Delete User"
                  )}
                </button>
              )}
            </div>

            {/* Form Status */}
            {formStatus && (
              <p className="text-center text-blue-700 mt-3">{formStatus}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
