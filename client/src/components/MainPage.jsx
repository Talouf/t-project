import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import MainTemplate from './MainTemplate';

const MainPage = () => {
    const [name, setName] = useState("");
    const [region, setRegion] = useState("euw1");
    const navigate = useNavigate(); 

    const handleSearch = () => {
        navigate('/playersearch', { state: { query: name, region: region } }); 
    };

    return (
        <MainTemplate>
            <div className="container mx-auto flex justify-center items-center h-screen">
                <input
                    type="text"
                    placeholder="Search players..."
                    className="text-black p-2 rounded w-1/2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="ml-2 text-black">
                    <option value="na1">NA</option>
                    <option value="euw1">EUW</option>
                    <option value="eun1">EUNE</option>
                </select>
                <button onClick={handleSearch} className="ml-4 bg-red-500 p-2 rounded">Search</button>
            </div>
        </MainTemplate>
    );
}

export default MainPage;
