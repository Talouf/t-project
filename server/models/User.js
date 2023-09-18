const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String, // Make sure to hash passwords before storing!
    email: String,
    // ... other user-related fields
  });
  
  module.exports = mongoose.model('User', userSchema);  