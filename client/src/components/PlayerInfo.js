import React from 'react';

function PlayerInfo({ playerData }) {
  return (
    <div>
      {/* Display player information here */}
      <h2>{playerData.name}</h2>
      {/* Add more player details as needed */}
    </div>
  );
}

export default PlayerInfo;