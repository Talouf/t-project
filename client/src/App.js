import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import PlayerSearchPage from './components/PlayerSearch';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/PlayerSearch" element={<PlayerSearchPage />} />
                {/* ... other routes ... */}
            </Routes>
        </Router>
    );
}

export default App;
