const express = require('express');
const axios = require('axios');
const Player = require('../models/player');
const router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

router.get('/:region/summoner/:name', async (req, res) => {
    const RIOT_BASE_URL = `https://${req.params.region}.api.riotgames.com/lol`;
    
    try {
        // Try to get the player from MongoDB first
        let player = await Player.findOne({ name: req.params.name, region: req.params.region });
        
        // Check if player data exists and is recent enough (e.g., less than 1 hour old)
        const ONE_HOUR = 60 * 60 * 1000;
        const now = Date.now();
        if (player && (now - player.lastUpdated) < ONE_HOUR) {
            return res.json(player.data);
        }
        
        // Fetch data from Riot API
        const summonerResponse = await axios.get(`${RIOT_BASE_URL}/summoner/v4/summoners/by-name/${req.params.name}?api_key=${RIOT_API_KEY}`);
        
        // Save/Update data in MongoDB
        const upsertData = {
            name: req.params.name,
            region: req.params.region,
            data: summonerResponse.data,
            lastUpdated: now
        };
        await Player.findOneAndUpdate({ name: req.params.name, region: req.params.region }, upsertData, { upsert: true });

        res.json(summonerResponse.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


