import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainTemplate from '../MainTemplate';

function ItemList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('https://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/item.json')
            .then(response => response.json())
            .then(data => {
                const itemsData = data.data;
                const itemsArray = Object.values(itemsData).filter(item => item.maps["11"] && item.gold.purchasable);
                setItems(itemsArray);
            })
            .catch(error => console.error("Error fetching items:", error));
    }, []);

    return (
        <MainTemplate>
            <div className="container mx-auto py-4">
                <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">LoL Items</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {items.map(item => (
                        <div key={item.image.full} className="relative group">
                            <Link to={`/item/${item.image.full.split('.')[0]}`}>
                                <img
                                    src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/item/${item.image.full}`}
                                    alt={item.name}
                                    className="w-12 h-12 mx-auto rounded-lg p-1 border border-gray-300 hover:shadow-md hover:border-yellow-500 cursor-pointer transform hover:scale-110 transition-transform"
                                />
                                <p className="text-center text-xs font-semibold text-blue-600 mt-2">
                                    {item.name}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </MainTemplate>
    );
}

export default ItemList;
