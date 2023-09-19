import React from 'react';

const MainTemplate = ({ children }) => {
    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <header className="flex justify-between items-center p-4 bg-blue-800">
                <div>
                    <a href="/champions" className="mr-4">Champions</a>
                    <a href="/items" className="mr-4">Items</a>
                    {/* ... other navigation links ... */}
                </div>
                <div>
                    <button className="mr-4 bg-red-500 p-2 rounded">Login</button>
                    <a href="https://twitter.com/">Contact Us</a>
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
}
export default MainTemplate;