// components/Logout.js

import React from 'react';

const Logout = ({ onLogout }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');  // Clear token
        onLogout();  // Update parent component or context
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
