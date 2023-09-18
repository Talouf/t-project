const runeSlotSchema = new mongoose.Schema({
  runes: [{
      id: Number,
      key: String,
      icon: String,
      name: String,
      shortDesc: String,
      longDesc: String
  }]
});

const runeSchema = new mongoose.Schema({
  id: Number,
  key: String,
  icon: String,
  name: String,
  slots: [runeSlotSchema]
});

const RuneEN = mongoose.model('RuneEN', runeSchema, 'runes_EN');
const RuneFR = mongoose.model('RuneFR', runeSchema, 'runes_FR');

module.exports = { RuneEN, RuneFR };