
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const Nav = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [menuList, setMenuList] = useState([]);
  const [parentMenu, setParentMenu] = useState([]);

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    handleWebMenuList();
  }, []);

  const handleWebMenuList = () => {
    if (storedToken == null) {
      window.location.href = "/";
    }

    const urls = `${process.env.REACT_APP_BACKEND_HOST}/menus/web-menu/list?access=true`;
    axios
      .get(urls, {
        headers: {
          Authorization: `Basic ${storedToken}`,
        },
      })
      .then(
        (res) => {
          const listMenu = res.data.express21.results.data.map((menu) => ({
            ...menu,
            isVisible: false, // Add visibility toggle for child menus
          }));
          setMenuList(listMenu);
          const menuParent = listMenu.filter((menu) => menu.parent_id === null);
          setParentMenu(menuParent);
          setLoading(false);
        },
        (error) => {
          if (error.response.status === 401) {
            console.error("Silahkan login kembali.");
            setError("Silahkan login kembali");

          }
          setError(error.message);
          setLoading(false);
          localStorage.removeItem("account");
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      );
  };

  const toggleChildMenu = (id) => {
    setMenuList((prev) =>
      prev.map((menu) =>
        menu.parent_id === id
          ? { ...menu, isVisible: !menu.isVisible }
          : { ...menu }
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("account");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
  className={`flex-shrink-0 top-0 left-0 h-full ${
    menuOpen ? "w-64" : "w-16"
  } ${
    darkMode ? "bg-gray-800" : "bg-white text-black"
  } transition-all duration-300 p-4 flex flex-col items-start space-y-6 border-r border-gray-300 z-50 shadow-2xl shadow-gray-500/50`}
>

        {/* Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 left-4 hover:text-gray-400 focus:outline-none z-50"
          style={{ marginBottom: "14px" }}
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Sidebar Menu */}
        {menuOpen && (
          <>
            {parentMenu.map((parent) => (
              <div key={parent.name} className="w-full">
                {/* Parent Menu Item */}
                <button
                  onClick={() => toggleChildMenu(parent.id)}
                  className={`flex items-center justify-start w-full text-left p-2 text-lg font-semibold hover:bg-gray-200 rounded-md transition-all duration-200`}
                >
                  <svg
                    className="w-5 h-5 mr-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {parent.name}
                </button>

                {/* Child Menu */}
                {menuList
                  .filter((menu) => menu.parent_id === parent.id)
                  .map((child) => (
                    <div
                      key={child.name}
                      className={`ml-6 pl-4 transition-all duration-300 ${
                        child.isVisible ? "block" : "hidden"
                      }`}
                    >
                      <Link to={`${child.url}`} className="block">
                        <p className="text-md font-medium p-2 rounded-md hover:bg-gray-200">
                          {child.name}
                        </p>
                      </Link>
                    </div>
                  ))}
              </div>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="mt-2 text-lg font-semibold flex items-center"
            >
              {darkMode ? (
                <>
                  <FaMoon className="mr-2" />
                  Dark Mode
                </>
              ) : (
                <>
                  <FaSun className="mr-2" />
                  Light Mode
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-lg font-semibold text-red-600 hover:text-red-500 mt-4 transition-all duration-200 flex items-center space-x-2"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </>
        )}
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`transition-all duration-300 ml-${menuOpen ? "64" : "20"} w-full`}
      >
        {/* Main Content Goes Here */}
      </div>
    </div>
  );
};

export default Nav;