import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-auto bg-gray-800 text-white transition-transform duration-300 lg:w-64 lg:h-full lg:static lg:block ${isOpen ? 'block' : 'hidden'}`}>
      <button
        className="lg:hidden p-4 absolute top-0 right-0 mt-4 mr-4"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <nav className="mt-16">
        <ul className="flex flex-col items-start lg:block">
          <li className="w-full">
            <Link to="/" className="block py-2 px-4 hover:bg-gray-700 w-full" onClick={toggleSidebar}>
              Dashboard
            </Link>
          </li>
          <li className="w-full">
            <Link to="/analytics" className="block py-2 px-4 hover:bg-gray-700 w-full" onClick={toggleSidebar}>
              Analytics
            </Link>
          </li>
          <li className="w-full">
            <Link to="/settings" className="block py-2 px-4 hover:bg-gray-700 w-full" onClick={toggleSidebar}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
