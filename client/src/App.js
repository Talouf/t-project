import logo from './logo.svg';
import './App.css';
import React from 'react';
import PlayerSearch from './components/PlayerSearch';

function App() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Riot API Player Search</h1>
            <PlayerSearch />
        </div>
    );
}

export default App;