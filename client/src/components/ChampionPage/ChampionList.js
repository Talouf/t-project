import React, { useState, useEffect } from 'react';
import MainTemplate from '../MainTemplate';
import { Link } from 'react-router-dom'; // Import Link from React Router

function ChampionList() {
    const [champions, setChampions] = useState([]);

    useEffect(() => {
        // Fetch the list of champions from Riot's Data Dragon API
        fetch('https://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/champion.json')
            .then(response => response.json())
            .then(data => {
                const championData = data.data;
                const championArray = Object.values(championData);
                setChampions(championArray);
            })
            .catch(error => console.error("Error fetching champions:", error));
    }, []);

    return (
        <MainTemplate>
            <div className="container mx-auto py-4">
                <h1 className="text-2xl font-bold mb-4 text-center">LoL Champions Search</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {champions.map(champion => {
                        const championName = champion.id;
                        const championImageURL = `/assets/images/champion/champion/${championName}.png`;

                        return (
                            <div key={champion.key} className="relative group">
                                <Link to={`/champion/${champion.id}`} className="group"> {/* Link to the champion detail page */}
                                    <div className="relative w-24 h-24 mx-auto sm:mx-0">
                                        <img
                                            src={championImageURL}
                                            alt={champion.name}
                                            className="w-24 h-24 mx-auto rounded-lg p-2 border border-yellow-500 hover:shadow-md hover:border-yellow-500 cursor-pointer transform hover:scale-105 transition-transform"
                                        />
                                        <p className="absolute bottom-0 left-0 w-full text-center font-semibold text-gray-800 bg-white bg-opacity-50 rounded hover:shine-text transition-all">
                                            {champion.name}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </MainTemplate>
    );
}

export default ChampionList;







