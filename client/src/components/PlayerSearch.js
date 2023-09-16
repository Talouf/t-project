import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlayerSearch() {
    const [name, setName] = useState("");
    const [region, setRegion] = useState("na1");
    const [playerData, setPlayerData] = useState(null);
    const [lastMatch, setLastMatch] = useState(null);
    const [playerRank, setPlayerRank] = useState(null);
    const [gameType, setGameType] = useState(""); // Game type filter
    const [matchHistory, setMatchHistory] = useState([]); // Match history state
    const [summonerSpellMapping, setSummonerSpellMapping] = useState({});

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
    );
}

export default PlayerSearch;