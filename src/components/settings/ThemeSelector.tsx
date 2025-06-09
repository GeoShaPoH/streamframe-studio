import React from 'react';
import { Palette } from 'lucide-react';
import { ThemeName } from '../../App';
import { themes } from '../../utils/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  setCurrentTheme: (theme: ThemeName) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  setCurrentTheme,
  customColor,
  setCustomColor
}) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-300 mb-2 block">
        <Palette className="inline w-4 h-4 mr-1" />
        Tema
      </label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {Object.keys(themes).map((themeName) => (
          <button
            key={themeName}
            onClick={() => setCurrentTheme(themeName as ThemeName)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTheme === themeName 
                ? 'bg-white bg-opacity-20 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {themeName.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Color personalizado */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentTheme('custom')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentTheme === 'custom' 
              ? 'bg-white bg-opacity-20 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Color personalizado
        </button>
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="w-12 h-9 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ThemeSelector;