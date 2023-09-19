import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MainTemplate from './MainTemplate';

function PlayerSearch() {
    const location = useLocation();
    const passedQuery = location.state?.query || ''; // Get the passed search query
    const passedRegion = location.state?.region || 'euw1'; // Get the passed region
    const [region, setRegion] = useState(passedRegion);
    const [playerData, setPlayerData] = useState(null);
    const [playerRank, setPlayerRank] = useState(null);
    const [gameType, setGameType] = useState(""); // Game type filter
    const [matchHistory, setMatchHistory] = useState([]); // Match history state
    const [summonerSpellMapping, setSummonerSpellMapping] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [name, setName] = useState(passedQuery || localStorage.getItem('lastSearchedPlayer') || '');


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
                console.error("Error fetching player data:", error);
                setError("Failed to fetch player data. Please try again later.");
            }
        }

        fetchSummonerSpellMapping();
    }, []);

    const fetchPlayerData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${name}`);
            setPlayerData(response.data.summoner);
            fetchPlayerRank(response.data.summoner.id);
            localStorage.setItem('lastSearchedPlayer', name); // Save to localStorage
            // Assuming you have an endpoint for match history filtered by game type
            fetchMatchHistory(response.data.summoner.puuid, gameType);
        } catch (error) {
            console.error("Error fetching player data:", error);
            setError("Failed to fetch player data. Please try again later.");
        }
        setIsLoading(false);
    };

    const fetchPlayerRank = async (summonerId) => {
        try {
            const rankResponse = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${summonerId}/rank`);
            setPlayerRank(rankResponse.data[0]);
        } catch (error) {
            console.error("Error fetching player data:", error);
            setError("Failed to fetch player data. Please try again later.");
        }
    };

    const fetchMatchHistory = async (puuid, gameType) => {
        try {
            const matchHistoryResponse = await axios.get(`http://localhost:5000/api/players/${region}/summoner/${puuid}/matchhistory?gameType=${gameType}`);
            setMatchHistory(matchHistoryResponse.data);
        } catch (error) {
            console.error("Error fetching player data:", error);
            setError("Failed to fetch player data. Please try again later.");
        }
    };
    function Participant({ participant, summonerSpellMapping }) {
        return (
            <div className="flex items-center space-x-4 mb-4">
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
    }

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
        <MainTemplate>
            <div className="bg-gray-800 text-white p-4">
                {/* Header Section */}
                <div className="mb-4 flex items-center space-x-4">
                    <img
                        className="w-24 h-24 rounded-full shadow-lg"
                        src={playerData?.profileIconId ? `https://ddragon.leagueoflegends.com/cdn/13.18.1/img/profileicon/${playerData.profileIconId}.png` : 'defaultImageURL'}
                        alt={`${playerData?.name}'s Profile Icon`}
                    />
                    <div>
                        <h2 className="text-3xl font-bold">{playerData?.name}</h2>
                        {playerRank && (
                            <div>
                                <p className="text-xl">{playerRank.tier} {playerRank.rank} - {playerRank.leaguePoints} LP</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Enter player name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') fetchPlayerData(); }}
                        className="p-2 rounded shadow text-black w-1/2"
                    />
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="ml-2 text-black">
                        <option value="na1">NA</option>
                        <option value="euw1">EUW</option>
                        <option value="eun1">EUNE</option>
                    </select>
                    <button onClick={fetchPlayerData} className="ml-4 bg-red-500 p-2 rounded shadow hover:bg-red-600">
                        Search
                    </button>
                </div>

                {isLoading && <div>Loading...</div>}
                {error && <div className="text-red-500">{error}</div>}

                <div className="flex flex-col md:flex-row mt-4">

                    {/* Player Rank Info */}
                    <div className="text-black md:w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4">
                        {playerRank && (
                            <div>
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

                    {/* Match History */}
                    <div className="mt-4 md:mt-0 md:w-2/3">
                        <h3 className="text-xl font-semibold mb-3">Match History:</h3>
                        <select className="text-black border rounded p-2 mb-4" value={gameType} onChange={(e) => setGameType(e.target.value)}>
                            <option value="">All</option>
                            <option value="ARAM">ARAM</option>
                            <option value="RANKED">RANKED</option>
                            <option value="CLASSIC">CLASSIC</option>
                        </select>

                        <ul className="space-y-4">
                            {matchHistory.map((match, index) => (
                                <li key={index} className={`bg-gray-200 p-4 rounded-lg shadow ${match.info.participants[0].win ? 'bg-blue-100' : 'bg-red-100'}`}>
                                    <p className="font-semibold mb-4">{match.info.gameMode} - {formatDate(match.info.gameStartTimestamp)}</p>

                                    {/* Blue Team */}
                                    <div className="bg-blue-200 p-4 rounded-lg mb-4">
                                        {match.info.participants.filter(p => p.teamId === 100).map((participant, pIndex) => (
                                            <Participant key={pIndex} participant={participant} summonerSpellMapping={summonerSpellMapping} />
                                        ))}
                                    </div>

                                    {/* Red Team */}
                                    <div className="bg-red-200 p-4 rounded-lg">
                                        {match.info.participants.filter(p => p.teamId === 100).map((participant, pIndex) => (
                                            <Participant key={pIndex} participant={participant} summonerSpellMapping={summonerSpellMapping} />
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