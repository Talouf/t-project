import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MainTemplate from './MainTemplate';

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
        } catch (error) {
        }
    };
    const renderParticipant = (participant, pIndex) => (
        <div key={pIndex} className="flex items-center space-x-4 mb-4">
            {/* Champion Icon */}
            <img className="w-14 h-14 rounded-full shadow" src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${participant.championName}.png`} alt={`${participant.championName} Icon`} />

            {/* Summoner Details */}
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    {/* Items & Spells */}
                    {Array(7).fill().map((_, itemIndex) => {
                        const itemId = participant[`item${itemIndex}`];
                        return itemId ? (
                            <img key={itemIndex} className="w-8 h-8" src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/item/${itemId}.png`} alt={`Item ${itemId} Icon`} />
                        ) : null;
                    })}
                    <img className="w-8 h-8 ml-4" src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/spell/${summonerSpellMapping[participant.summoner1Id]}.png`} alt={`Summoner Spell ${participant.summoner1Id} Icon`} />
                    <img className="w-8 h-8" src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/spell/${summonerSpellMapping[participant.summoner2Id]}.png`} alt={`Summoner Spell ${participant.summoner2Id} Icon`} />
                </div>

                {/* KDA & Damage */}
                <p>{participant.kills}/{participant.deaths}/{participant.assists} KDA</p>
                <p>{participant.totalDamageDealtToChampions} Damage</p>
            </div>
        </div>
    );
    const getRecentlyPlayedWith = () => {
        const allPlayers = matchHistory.flatMap(match =>
            match.info.participants.map(participant => participant.summonerName)
        ).filter(playerName => playerName !== playerData.name); // Exclude the main player

        const playerCount = {};

        allPlayers.forEach(playerName => {
            if (playerCount[playerName]) {
                playerCount[playerName]++;
            } else {
                playerCount[playerName] = 1;
            }
        });

        // Sorting the players based on their frequency and then slice to get the last 5
        const sortedPlayers = Object.entries(playerCount).sort(([, aCount], [, bCount]) => bCount - aCount).slice(0, 5);
        return sortedPlayers;
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
                </div>
                {/* ... rest of your component content ... */}


                <div className="flex flex-col md:flex-row mt-4">

                    {/* Player Rank Info - MOBILE: Top, DESKTOP: Left */}
                    <div className="text-black md:w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg">
                        {playerData && (
                            <div className="flex items-center space-x-4">
                                <img className="w-20 h-20 rounded-full shadow-lg" src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/profileicon/${playerData.profileIconId}.png`} alt={`${playerData.name}'s Profile Icon`} />
                                <h2 className="text-2xl font-bold">{playerData.name}</h2>
                            </div>
                        )}
                        {playerRank && (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-3">Rank Details:</h3>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p>Queue Type: {playerRank.queueType}</p>
                                    <p>Tier: {playerRank.tier}</p>
                                    <p>Rank: {playerRank.rank}</p>
                                    <p>League Points: {playerRank.leaguePoints}</p>
                                    <p>Wins: {playerRank.wins}</p>
                                    <p>Losses: {playerRank.losses}</p>
                                </div>
                            </div>
                        )}
                        <div className="mt-4 bg-gray-300 p-4 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-3 text-gray-700">Recently Played With:</h3>
                            <ul>
                                {getRecentlyPlayedWith().map(([playerName, count], index) => (
                                    <li key={index} className="mb-1 text-gray-700">{playerName} ({count} times)</li>
                                ))}
                            </ul>
                        </div>
                    </div>



                    {/* Match History - MOBILE: Below Rank, DESKTOP: Center */}
                    <div className="mt-4 md:mt-0 md:ml-4 md:w-1/3">
                        <h3 className="text-xl font-semibold mb-3">Match History:</h3>
                        <select className="text-black border rounded p-2 mb-4" value={gameType} onChange={(e) => setGameType(e.target.value)}>
                            <option value="">All</option>
                            <option value="ARAM">ARAM</option>
                            <option value="RANKED">RANKED</option>
                            <option value="CLASSIC">CLASSIC</option>
                            {/* Add other game types as needed */}
                        </select>

                        <ul className="space-y-4">
                            {matchHistory.map((match, index) => (
                                <li key={index} className={`bg-gray-200 p-4 rounded-lg shadow ${match.info.participants[0].win ? 'bg-blue-100' : 'bg-red-100'}`}>
                                    <p className="font-semibold mb-4">{match.info.gameMode} - {formatDate(match.info.gameStartTimestamp)}</p>

                                    {/* Blue Team */}
                                    <div className="bg-blue-200 p-4 rounded-lg mb-4">
                                        {match.info.participants.filter(p => p.teamId === 100).map((participant, pIndex) => (
                                            renderParticipant(participant, pIndex)
                                        ))}
                                    </div>

                                    {/* Red Team */}
                                    <div className="bg-red-200 p-4 rounded-lg">
                                        {match.info.participants.filter(p => p.teamId === 200).map((participant, pIndex) => (
                                            renderParticipant(participant, pIndex)
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </div>
        </MainTemplate >
    );
}

export default PlayerSearch;