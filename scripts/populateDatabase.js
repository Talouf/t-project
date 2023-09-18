require('dotenv').config({ path: './server/.env' });
const { MY_APP_MONGODB_URI } = process.env;
const mongoose = require('mongoose');
const _ = require('lodash');
const axios = require('axios');
const fetch = require('node-fetch');
const Promise = require('bluebird');  // For concurrency
const Champion = require('../server/models/Champion');
const Item = require('../server/models/Item');
const Rune = require('../server/models/Rune');
const SummonerSpell = require('../server/models/SummonerSpell');

async function fetchData(url) {
    const response = await axios.get(url);
    if (response.status !== 200) {
        throw new Error(`Error fetching data from URL: ${url}`);
    }
    return response.data;
}

async function fetchChampions() {
    // Fetch champions data
    const championsData = await fetchData('https://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json');
    return Object.values(championsData.data).map(champion => ({
        id: champion.id,
        key: champion.key,
        name: champion.name,
        title: champion.title,
        blurb: champion.blurb,
        image: champion.image,
        tags: champion.tags,
        partype: champion.partype,
        stats: champion.stats
    }));
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching data from URL: ${url}`);
    }
    return await response.json();
}

async function populateDatabase() {
    try {
        await mongoose.connect(MY_APP_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Fetch champions and populate concurrently
        const champions = await fetchChampions();
        const chunks = _.chunk(champions, 50);  // lodash's chunk method to break data into chunks of 50

        await Promise.map(chunks, async (chunk) => {
            await Champion.insertMany(chunk);
        }, { concurrency: 5 });  // Adjust concurrency as needed

        console.log('Champions populated');

        // ... similar logic for runes, summoner spells, and items ...

    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

populateDatabase();