import React from 'react';
import { useUser } from '../context/UserContext';
import Login from './Login';
import Logout from './Logout';

const MainTemplate = ({ children }) => {
    const { user, setUser } = useUser();

    const handleLoginSuccess = (token) => {
        // Optionally decode token and set user data
        setUser({ /* your user data */ });
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <header className="flex justify-between items-center p-4 bg-blue-800">
                <div>
                    <a href="/champions" className="mr-4">Champions</a>
                    <a href="/items" className="mr-4">Items</a>
                    {/* ... other navigation links ... */}
                </div>
                <div>
                    {user ? (
                        <>
                            <span className="mr-4">Welcome, {user.name}!</span>
                            <Logout onLogout={handleLogout} />
                        </>
                    ) : (
                        <Login onLoginSuccess={handleLoginSuccess} />
                    )}
                    <a href="https://twitter.com/" className="ml-4">Contact Us</a>
                </div>
            </header>

            <main>
                {children}
            </main>

            <footer className="flex justify-center items-center p-4 bg-blue-800">
                <a href="localhost:3000" className="mr-4">Facebook</a>
                <a href="https://twitter.com/" className="mr-4">Twitter</a>
                <a href="https://twitter.com/" className="mr-4">Instagram</a>
                {/* ... other social media links ... */}
            </footer>
        </div>
    );
};

export default MainTemplate;
