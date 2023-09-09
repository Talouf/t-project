const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const playersRouter = require('./routes/players');

const app = express();

// Environment Variables
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Routes
app.use('/api/players', playersRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
