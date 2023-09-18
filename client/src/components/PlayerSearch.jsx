import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MainTemplate from './MainTemplate';
import useDebounce from './useDebounce';

function PlayerSearch() {
    const location = useLocation();
    const passedQuery = location.state?.query || ''; // Get the passed search query
    const passedRegion = location.state?.region || 'euw1'; // Get the passed region
    const [name, setName] = useState(passedQuery);
    const [region, setRegion] = useState(passedRegion);
    const [playerData, setPlayerData] = useState(null);
    const [playerRank, setPlayerRank] = useState(null);
    const [gameType, setGameType] = useState(""); // Game type filter
    const [matchHistory, setMatchHistory] = useState([]); // Match history state
    const [summonerSpellMapping, setSummonerSpellMapping] = useState({});
    const debouncedSearchTerm = useDebounce(name, 300);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        async function fetchSummonerSpellMapping() {
            try {
                const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/summoner.json');
                const spells = response.data.data;
                const mapping = {};

                for (let key in spells) {
                    mapping[spells[key].key] = key;
                }

                setSummonerSpellMapping(mapping);
            } catch (error) {
                console.error("Error fetching summoner spell data:", error);
            }
        }

        fetchSummonerSpellMapping();
    }, []);

    useEffect(() => {
        if (name && region) {
            fetchPlayerData();
        }
    }, [name, region]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            // Fetch the suggestions here
            // For now, let's just log the debounced term
            console.log(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    const fetchPlayerSuggestions = async (query) => {
        try {
            const response = await axios.get(`YOUR_ENDPOINT_FOR_PLAYER_SUGGESTIONS?query=${query}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching player suggestions:", error);
        }
    };

    const fetchPlayerData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${name}`);
            setPlayerData(response.data.summoner);
            fetchPlayerRank(response.data.summoner.id);
            // Assuming you have an endpoint for match history filtered by game type
            fetchMatchHistory(response.data.summoner.puuid, gameType);
        } catch (error) {
            console.error("Error fetching player data:", error);
        }
    };

    const fetchPlayerRank = async (summonerId) => {
        try {
            const rankResponse = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${summonerId}/rank`);
            setPlayerRank(rankResponse.data[0]);
        } catch (error) {
            console.error("Error fetching rank data:", error);
        }
    };

    const fetchMatchHistory = async (puuid, gameType) => {
        try {
            const matchHistoryResponse = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${puuid}/matchhistory?gameType=${gameType}`);
            setMatchHistory(matchHistoryResponse.data);
            console.log("Match History:", matchHistoryResponse.data); // <-- Add this line
        } catch (error) {
            console.error("Error fetching match history:", error);
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
        <MainTemplate> {/* Wrap the content with MainTemplate */}
            <div className="p-4">
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Enter player name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            fetchPlayerSuggestions(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchPlayerData();
                            }
                        }}
                        className="p-2 rounded shadow text-black"
                    />
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="ml-2 text-black">
                        <option value="na1">NA</option>
                        <option value="euw1">EUW</option>
                        <option value="eun1">EUNE</option>
                    </select>
                    <button onClick={fetchPlayerData} className="ml-4 bg-red-500 p-2 rounded shadow text-white hover:bg-red-600">
                        Search
                    </button>
                    <div className="suggestions">
                        {suggestions.map((player, index) => (
                            <div key={index} className="suggestion" onClick={() => setName(player.name)}>
                                {player.name}  {/* Adjust based on the structure of your suggestions data */}
                            </div>
                        ))}
                    </div>
                </div>
                {/* ... rest of your component content ... */}


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

                <div>
                    <h3>Match History:</h3>
                    <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                        <option value="">All</option>
                        <option value="ARAM">ARAM</option>
                        <option value="CLASSIC">CLASSIC</option>
                        {/* Add other game types as needed */}
                    </select>
                    <ul>
                        {matchHistory.map((match, index) => (
                            <li key={index}>
                                {match.info.gameMode} - {formatDate(match.info.gameStartTimestamp)}
                                <ul>
                                    {match.info.participants.map((participant, pIndex) => (
                                        <li key={pIndex}>
                                            <img src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${participant.championName}.png`} alt={`${participant.championName} Icon`} />
                                            {Array(7).fill().map((_, itemIndex) => {
                                                const itemId = participant[`item${itemIndex}`];
                                                return itemId ? (
                                                    <img key={itemIndex} src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/item/${itemId}.png`} alt={`Item ${itemId} Icon`} />
                                                ) : null;
                                            })}
                                            <img src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/spell/${summonerSpellMapping[participant.summoner1Id]}.png`} alt={`Summoner Spell ${participant.summoner1Id} Icon`} />
                                            <img src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/spell/${summonerSpellMapping[participant.summoner2Id]}.png`} alt={`Summoner Spell ${participant.summoner2Id} Icon`} />

                                            {participant.summonerName} - {participant.championName}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </MainTemplate >
    );
}

export default PlayerSearch;