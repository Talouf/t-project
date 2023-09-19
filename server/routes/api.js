const express = require('express');
const axios = require('axios');
const router = express.Router();
const Player = require('../models/player');
const User = require('../models/User');
const { ChampionEN, ChampionFR } = require('../models/Champion');
const Rune = require('../models/Rune');
const SummonerSpell = require('../models/SummonerSpell');
const Item = require('../models/Item');

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

// Fetch all champions based on language
router.get('/champions/:language', async (req, res) => {
    const language = req.params.language;

    try {
        let champions;

        if (language === 'EN') {
            champions = await ChampionEN.find();
        } else if (language === 'FR') {
            champions = await ChampionFR.find();
        } else {
            return res.status(400).json({ message: "Invalid language parameter" });
        }

        res.json(champions);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Fetch a specific champion by its name and language
router.get('/champion/:name/:language', async (req, res) => {
    const { name, language } = req.params;

    try {
        let champion;

        if (language === 'EN') {
            champion = await ChampionEN.findOne({ name: name });
        } else if (language === 'FR') {
            champion = await ChampionFR.findOne({ name: name });
        } else {
            return res.status(400).json({ message: "Invalid language parameter" });
        }

        if (!champion) {
            return res.status(404).json({ message: "Champion not found" });
        }

        res.json(champion);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
router.post('/populate-champions', async (req, res) => {
    const championsData = req.body;
    try {
        // Insert championsData into the respective collections based on language
        const championsEN = championsData.filter(champ => champ.language === 'EN');
        const championsFR = championsData.filter(champ => champ.language === 'FR');

        await ChampionEN.insertMany(championsEN);
        await ChampionFR.insertMany(championsFR);

        res.status(200).send('Data inserted successfully');
    } catch (error) {
        console.error("Error inserting champions:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;