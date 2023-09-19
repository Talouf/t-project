import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainTemplate from '../MainTemplate';

function ChampionDetail() {
    const { id: championId } = useParams();
    const [champion, setChampion] = useState(null);

    useEffect(() => {
        fetch(`https://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/champion/${championId}.json`)
            .then(response => response.json())
            .then(data => {
                const championData = data.data[championId];
                setChampion(championData);
            })
            .catch(error => console.error("Error fetching champion details:", error));
    }, [championId]);

    if (!champion) return <div>Loading...</div>;

    return (
        <MainTemplate>
            <div className="text-black container mx-auto py-4">
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{champion.name}</h1>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`} alt={champion.name} className="rounded-lg shadow-lg" />
                        </div>
                        <div className="w-full md:w-1/2 lg:w-2/3 p-4">
                            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Stats</h2>
                                <ul className="list-disc pl-5 mt-4 grid grid-cols-2 gap-2">
                                <li>HP: {champion.stats.hp} (+{champion.stats.hpperlevel} per level)</li>
                            <li>Mana: {champion.stats.mp} (+{champion.stats.mpperlevel} per level)</li>
                            <li>HP Regen: {champion.stats.hpregen} (+{champion.stats.hpregenperlevel} per level)</li>
                            <li>Mana Regen: {champion.stats.mpregen} (+{champion.stats.mpregenperlevel} per level)</li>
                            <li>Armor: {champion.stats.armor} (+{champion.stats.armorperlevel} per level)</li>
                            <li>Magic Resist: {champion.stats.spellblock} (+{champion.stats.spellblockperlevel} per level)</li>
                            <li>Attack Damage: {champion.stats.attackdamage} (+{champion.stats.attackdamageperlevel} per level)</li>
                            <li>Attack Speed: {champion.stats.attackspeed} (+{champion.stats.attackspeedperlevel} per level)</li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Abilities</h2>
                                {champion.spells.map((spell, index) => (
                                    <div key={index} className="mb-4 flex border-t pt-4">
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/spell/${spell.image.full}`} alt={spell.name} className="w-16 h-16 mr-4" />
                                        <div>
                                            <h3 className="text-xl font-medium">{spell.name}</h3>
                                            <p className="text-sm mt-2">{spell.description}</p>
                                            <ul className="list-disc pl-5 mt-2 text-sm">
                                            <li>Cooldown: {spell.cooldown.join('/')} seconds</li>
                                        <li>Mana Cost: {spell.cost.join('/')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainTemplate>
    );
}

export default ChampionDetail;
