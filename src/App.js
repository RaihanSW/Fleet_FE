import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContentLayout from './components/content-layout';
import Dashboard from './Dashboard';
import LoginPortal from './loginportal';
import UserPage from './userpagetest';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="*"element={<ContentLayout/>} />
        <Route path="/" element={<LoginPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userpagetest" element={<UserPage />} />
      </Routes>
    </Router>
    </>
  

  );
};

export default App;
