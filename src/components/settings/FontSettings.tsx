import React from 'react';
import { Type } from 'lucide-react';

interface FontSettingsProps {
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize
}) => {
  const fonts = [
    'Poppins',
    'Roboto',
    'Inter',
    'Montserrat',
    'Space Grotesk',
    'Bebas Neue',
    'Orbitron',
    'Russo One'
  ];

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-300 mb-2 block">
        <Type className="inline w-4 h-4 mr-1" />
        Tipografía
      </label>
      <div className="space-y-2">
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <label className="text-xs text-gray-400">Tamaño:</label>
          <input
            type="range"
            min="14"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="flex-1"
          />
          <span className="text-xs text-gray-400 w-12">{fontSize}px</span>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;