import React from 'react';

interface NameSettingsProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  namePosition: string;
  setNamePosition: (position: string) => void;
}

const NameSettings: React.FC<NameSettingsProps> = ({
  playerName,
  setPlayerName,
  namePosition,
  setNamePosition
}) => {
  return (
    <>
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Nombre del Streamer
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Posición del nombre
        </label>
        <select
          value={namePosition}
          onChange={(e) => setNamePosition(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="bottom-right">Abajo Derecha</option>
          <option value="bottom-left">Abajo Izquierda</option>
          <option value="top-left">Arriba Izquierda</option>
          <option value="top-right">Arriba Derecha</option>
        </select>
      </div>
    </>
  );
};

export default NameSettings;