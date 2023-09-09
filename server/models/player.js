// models/player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: String,
    region: String,
    data: Object,   // This is where the Riot API response for the player will be stored
    lastUpdated: Date
});

module.exports = mongoose.model('Player', playerSchema);
