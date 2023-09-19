require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const playersRouter = require('./routes/api');
const championBuildsRoutes = require('./routes/championBuilds');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // This should be the address where your frontend is running.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());

// MongoDB Connection
console.log('MongoDB Connection String:', process.env.MY_APP_MONGODB_URI);
mongoose.connect(process.env.MY_APP_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.get('/', (req, res) => {
    res.send('Server is running');
});
// Routes
app.use('/api/players', playersRouter);
app.use('/api/championBuilds', championBuildsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});