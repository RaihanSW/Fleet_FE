import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom"; // Using useNavigate and useParams

const Dashboard = () => {
  const { uid } = useParams(); // Get the uid from the URL params
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    roles_id: "",
  });

  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [formStatus, setFormStatus] = useState(""); // Form status message
  const [isSubmitting, setIsSubmitting] = useState(false); // Submit button state
  const [isDeleted, setIsDeleted] = useState(false); // State for deletion tracking

  const navigate = useNavigate(); // Navigation hook to redirect user

  // Fetch user data if UID exists and is valid
  useEffect(() => {
    if (uid && uid !== ":uid") {
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
            setUser(userData); // Set user data for edit
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

      fetchUserData();
    } else {
      // No valid UID or placeholder ":uid", show an empty form
      setLoading(false); // Immediately set loading to false
    }
  }, [uid, isDeleted]); // Trigger re-fetch if the user is deleted

  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (add or update user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    setIsSubmitting(true);
    setFormStatus("");
  
    const updatedData = {
      ...formData,
      username: formData.email.split("@")[0], // Example of generating a username
      is_admin: false,
      is_active: true,
    };
  
    try {
      let response;
      if (uid && uid !== ":uid") {
        // Update user if valid UID exists
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/users/account`,
          { ...updatedData, uid },
          {
            headers: {
              Authorization: `Basic ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Add new user if UID is invalid or placeholder ":uid"
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/users/account`,
          updatedData,
          {
            headers: {
              Authorization: `Basic ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
  
      const responseData = response.data?.express21?.results?.data;
  
      if (response.status === 200 && responseData) {
        setFormStatus(uid && uid !== ":uid" ? "User updated successfully!" : "User added successfully!");
        if (!uid || uid === ":uid") {
          setFormData({ first_name: "", last_name: "", email: "", roles_id: "" }); // Reset form after add
        }
      } else {
        const errorMessage = response.data?.express21?.error_message || "Unknown error occurred.";
        setFormStatus(`Failed to submit data: ${errorMessage}`);
      }
    } catch (err) {
      const serverError =
        err.response?.data?.express21?.error_message || "An error occurred while submitting the data.";
      console.error("Error submitting data:", err);
      setFormStatus(serverError);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Handle user deletion
  const handleDelete = async (uid) => {
    const token = localStorage.getItem("token");

    try {
      setIsSubmitting(true);

      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_HOST}/users/account`,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
          data: { uid },
        }
      );

      if (response.status === 200) {
        setFormStatus("User deleted successfully!");
        setIsDeleted(true); // Set deletion status
        setFormData({ first_name: "", last_name: "", email: "", roles_id: "" }); // Clear form data
        setTimeout(() => {
          navigate("/users"); // Redirect to user list
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
          {uid && uid !== ":uid" ? `Edit User - ${user?.username}` : "Add New User"}
        </h1>

        {/* Error Handling: Display empty form when error occurs */}
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

            {/* Submit and Delete Buttons */}
            <div className="flex justify-between items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin" /> : uid && uid !== ":uid" ? "Update User" : "Add User"}
              </button>

              {uid && uid !== ":uid" && (
                <button
                  onClick={() => handleDelete(uid)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 px-4 flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Delete User"}
                </button>
              )}
            </div>

            {/* Form Status */}
            {formStatus && (
              <p className={`text-center mt-4 ${formStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                {formStatus}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
