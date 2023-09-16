import React, { useState } from 'react';
import axios from 'axios';

function PlayerSearch() {
    const [name, setName] = useState("");
    const [region, setRegion] = useState("na1");
    const [playerData, setPlayerData] = useState(null);
    const [lastMatch, setLastMatch] = useState(null);
    const [playerRank, setPlayerRank] = useState(null);

    const fetchPlayerData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${name}`);
            setPlayerData(response.data.summoner); // Update this line to set the summoner data
            fetchPlayerRank(response.data.summoner.id); // Fetch rank data using the summonerId
            setLastMatch(response.data.lastMatch);
        } catch (error) {
            console.error("Error fetching player data:", error);
        }
    };

    const fetchPlayerRank = async (summonerId) => {
        try {
            const rankResponse = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${summonerId}/rank`);
            setPlayerRank(rankResponse.data[0]); // Assuming the data is an array and you're interested in the first entry
        } catch (error) {
            console.error("Error fetching rank data:", error);
        }
    };    

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minutes ${remainingSeconds} seconds`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter player name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="na1">NA</option>
                    <option value="euw1">EUW</option>
                    <option value="eun1">EUNE</option>
                </select>
                <button onClick={fetchPlayerData}>Search</button>
            </div>

            {playerData && (
                <div>
                    <h2>{playerData.name}</h2>
                    <img src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/profileicon/${playerData.profileIconId}.png`} alt={`${playerData.name}'s Profile Icon`} />
                </div>
            )}
            {playerRank && (
                <div>
                    <h3>Rank Details:</h3>
                    <p>Queue Type: {playerRank.queueType}</p>
                    <p>Tier: {playerRank.tier}</p>
                    <p>Rank: {playerRank.rank}</p>
                    <p>League Points: {playerRank.leaguePoints}</p>
                    <p>Wins: {playerRank.wins}</p>
                    <p>Losses: {playerRank.losses}</p>
                </div>
            )}

            {lastMatch && (
                <div>
                    <h3>Last Match Played:</h3>
                    <p>Game Mode: {lastMatch.info.gameMode}</p>
                    <p>Duration: {formatDuration(lastMatch.info.gameDuration)}</p>
                    <p>Map: {lastMatch.info.mapId}</p>
                    <p>Timestamp: {formatDate(lastMatch.info.gameStartTimestamp)}</p>
                    <h4>Players:</h4>
                    <ul>
                        {lastMatch.info.participants.map((participant, index) => (
                            <li key={index}>
                                {participant.summonerName} - {participant.championName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PlayerSearch;

