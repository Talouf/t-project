const mongoose = require('mongoose');

const skinSchema = new mongoose.Schema({
    skinId: Number,
    name: String,
    num: Number,
    championId: Number,  // Reference to the associated champion
});

module.exports = mongoose.model('Skin', skinSchema);