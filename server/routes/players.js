const express = require('express');
const axios = require('axios');
const router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

const fetchPlayerRank = async (summonerId, region) => {
    const RIOT_BASE_URL = `https://${region}.api.riotgames.com/lol`;
    try {
        const rankResponse = await axios.get(`${RIOT_BASE_URL}/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`);
        console.log("Rank Data:", rankResponse.data);
        return rankResponse.data;
    } catch (error) {
        console.error("Error fetching player rank:", error);
        return null;
    }
};


const fetchMatchHistory = async (puuid, region, gameType) => {
    const RIOT_BASE_URL = `https://${region}.api.riotgames.com/lol`;
    try {
        const matchlistResponse = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${RIOT_API_KEY}`);
        const matchDetailsPromises = matchlistResponse.data.map(matchId => 
            axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`)
        );
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        const matches = matchDetailsResponses.map(response => response.data);
        return gameType ? matches.filter(match => match.info.gameMode === gameType) : matches;
    } catch (error) {
        console.error("Error fetching match history:", error);
        return null;
    }
};

router.get('/:region/summoner/:name', async (req, res) => {
    const RIOT_BASE_URL = `https://${req.params.region}.api.riotgames.com/lol`;
    const gameType = req.query.gameType;

    try {
        const encodedName = encodeURIComponent(req.params.name);
        const summonerResponse = await axios.get(`${RIOT_BASE_URL}/summoner/v4/summoners/by-name/${encodedName}?api_key=${RIOT_API_KEY}`);
        const rankData = await fetchPlayerRank(summonerResponse.data.id, req.params.region);
        const matchHistoryData = await fetchMatchHistory(summonerResponse.data.puuid, req.params.region, gameType);
        res.json({
            summoner: summonerResponse.data,
            rank: rankData,
            matchHistory: matchHistoryData
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// New endpoint to fetch rank by summoner ID
router.get('/:region/summoner/:summonerId/rank', async (req, res) => {
    console.log("Accessing match history for:", req.params.puuid);
    try {
        const rankData = await fetchPlayerRank(req.params.summonerId, req.params.region);
        if (rankData) {
            res.json(rankData);
        } else {
            res.status(404).json({ message: "Rank data not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
router.get('/:region/summoner/:puuid/matchhistory', async (req, res) => {
    const gameType = req.query.gameType;
    try {
        const matchHistoryData = await fetchMatchHistory(req.params.puuid, req.params.region, gameType);
        res.json(matchHistoryData);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
module.exports = router;