import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainTemplate from '../MainTemplate';

function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch('https://ddragon.leagueoflegends.com/cdn/13.8.1/data/en_US/item.json')
            .then(response => response.json())
            .then(data => {
                setItem(data.data[id]);
            })
            .catch(error => console.error("Error fetching item details:", error));
    }, [id]);

    const parseDescription = (desc) => {
        return desc.replace(/<[^>]*>/g, ' ').trim();
    };

    return (
        <MainTemplate>
            <div className="container mx-auto py-4">
                {item && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/item/${item.image.full}`}
                                alt={item.name}
                                className="w-32 h-32 mx-auto mb-4 shadow-lg rounded-full"
                            />
                            <h1 className="text-3xl font-bold ml-4">{item.name}</h1>
                        </div>
                        <p className="text-center text-gray-600 mb-4">{parseDescription(item.description)}</p>
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-2">Stats:</h2>
                            {Object.entries(item.stats).map(([key, value]) => (
                                <p key={key} className="text-gray-500">{key}: <span className="text-black">{value}</span></p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainTemplate>
    );
}

export default ItemDetail;