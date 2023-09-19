const axios = require('axios');

const riotAPI = axios.create({
    baseURL: 'https://<region>.api.riotgames.com/lol/', // replace <region> with appropriate region like 'na1'
    timeout: 10000, // 10 seconds timeout
    headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY // Assuming you've stored your Riot API key in an environment variable
    }
});

module.exports = riotAPI;