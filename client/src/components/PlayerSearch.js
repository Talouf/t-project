import React, { useState } from 'react';
import axios from 'axios';

function PlayerSearch() {
    const [name, setName] = useState("");
    const [region, setRegion] = useState("na1");  // default region set to "na1"
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPlayerData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/players/${region}/summoner/${name}`);
            setPlayerData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching player data:", error);
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter player name"
                    className="p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="ml-2 p-2 border rounded">
                    <option value="na1">NA</option>
                    <option value="euw1">EUW</option>
                    <option value="eun1">EUNE</option>
                    {/* You can add more regions based on the Riot API's available regions */}
                </select>
                <button onClick={fetchPlayerData} className="ml-2 p-2 bg-blue-500 text-white rounded">Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {playerData && (
                <div>
                    <h2 className="text-xl mb-2">{playerData.name}</h2>
                    <p>ID: {playerData.id}</p>
                    <p>Account ID: {playerData.accountId}</p>
                    {/* You can add more details based on the fetched data */}
                </div>
            )}
        </div>
    );
}

export default PlayerSearch;