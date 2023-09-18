const mongoose = require('mongoose');

const summonerSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  tooltip: String,
  maxrank: Number,
  cooldown: [Number],
  cost: [Number],
  effect: [[Number]],
  key: String,
  summonerLevel: Number,
  modes: [String],
  costType: String,
  range: [Number],
  image: {
      full: String,
      sprite: String,
      group: String,
      x: Number,
      y: Number,
      w: Number,
      h: Number
  }
});

const SummonerEN = mongoose.model('SummonerEN', summonerSchema, 'summoner_EN');
const SummonerFR = mongoose.model('SummonerFR', summonerSchema, 'summoner_FR');

module.exports = { SummonerEN, SummonerFR };