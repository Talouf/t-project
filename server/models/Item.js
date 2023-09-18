const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  colloq: String,
  plaintext: String,
  into: [String],
  image: {
      full: String,
      sprite: String,
      group: String,
      x: Number,
      y: Number,
      w: Number,
      h: Number
  },
  gold: {
      base: Number,
      purchasable: Boolean,
      total: Number,
      sell: Number
  },
  tags: [String],
  stats: Object // Given the diversity of the stats, you can represent it as a generic object
});

const ItemEN = mongoose.model('ItemEN', itemSchema, 'items_EN');
const ItemFR = mongoose.model('ItemFR', itemSchema, 'items_FR');

module.exports = { ItemEN, ItemFR };