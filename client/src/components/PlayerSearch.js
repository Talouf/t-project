import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlayerSearch() {
    const [name, setName] = useState("");
    const [region, setRegion] = useState("na1");
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [version, setVersion] = useState("13.18.1");
    const [championsData, setChampionsData] = useState({});
    const [showDetails, setShowDetails] = useState(false); // State to toggle the detailed data visibility

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await axios.get('http://ddragon.leagueoflegends.com/api/versions.json');
                setVersion(response.data[0]);
            } catch (error) {
                console.error("Error fetching version data:", error);
            }
        };
        fetchVersion();
    }, []);

    useEffect(() => {
        const fetchChampionData = async () => {
            try {
                const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
                let champData = {};
                Object.values(response.data.data).forEach(champion => {
                    champData[champion.key] = {
                        name: champion.name,
                        img: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`
                    };
                });
                setChampionsData(champData);
            } catch (error) {
                console.error("Error fetching champion data:", error);
            }
        };
        fetchChampionData();
    }, [version]);

    const fetchPlayerData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${name}`);
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
                {/* Search Bar */}
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
                </select>
                <button onClick={fetchPlayerData} className="ml-2 p-2 bg-blue-500 text-white rounded">Search</button>
            </div>

            {playerData && (
                <div>
                    {/* Previous Year Ranked - Assuming you have such a data in playerData.prevYearRanked */}
                    <h3 className="text-xl mb-2">{playerData.prevYearRanked}</h3>

                    {/* Player Logo & Name */}
                    <div className="flex items-center mb-4">
                        <img src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${playerData.profileIconId}.png`} alt={`${playerData.name}'s Profile Icon`} className="mr-4" />
                        <h2 className="text-xl">{playerData.name}</h2>
                    </div>

                    {/* Summary Button */}
                    <button onClick={() => setShowDetails(!showDetails)} className="mb-4 bg-blue-500 text-white p-2 rounded">Summary</button>

                    {/* Detailed Data - Only show if showDetails is true */}
                    {showDetails && (
                        <div className="flex">
                            {/* This Year's Champions Played */}
                            <div className="w-1/2 pr-4">
                                <h4>Champions Played This Year:</h4>
                                {/* Iterate over the champions and display them */}
                            </div>

                            {/* Match History */}
                            <div className="w-1/2 pl-4">
                                <h4>Match History:</h4>
                                {/* Buttons for Queue Types */}
                                <div className="mb-2">
                                    <button className="p-2 m-1 bg-gray-300 rounded">All</button>
                                    <button className="p-2 m-1 bg-gray-300 rounded">Ranked Solo</button>
                                    <button className="p-2 m-1 bg-gray-300 rounded">Ranked Flex</button>
                                    <button className="p-2 m-1 bg-gray-300 rounded">ARAM</button>
                                </div>

                                {/* Matches List - Display the last 20 games or as per the filter */}
                            </div>
                        </div>
                    )}

                    {/* Recently Played - Last 20 games */}
                    <div>
                        <h4 className="mb-2">Recently Played (Last 20 games):</h4>
                        {/* Display the list of recent 20 games */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerSearch;