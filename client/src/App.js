import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import MainPage from './components/MainPage';
import PlayerSearchPage from './components/PlayerSearch';
import ChampionList from './components/ChampionPage/ChampionList';
import ChampionDetail from './components/ChampionPage/ChampionDetail';
import ItemList from './components/ItemPage/ItemList';
import ItemDetail from './components/ItemPage/ItemDetail';

function App() {
    return (
        <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/PlayerSearch" element={<PlayerSearchPage />} />
                <Route path="/champions" element={<ChampionList />} />
                <Route path="/champion/:id" element={<ChampionDetail />} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                {/* ... other routes ... */}
            </Routes>
        </Router>
        </UserProvider>
    );
}

export default App;
