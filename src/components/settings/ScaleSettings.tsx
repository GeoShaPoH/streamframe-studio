import React from "react";
import { Maximize2 } from "lucide-react";

interface ScaleSettingsProps {
  globalScale: number;
  setGlobalScale: (scale: number) => void;
}

const ScaleSettings: React.FC<ScaleSettingsProps> = ({
  globalScale,
  setGlobalScale,
}) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-300 mb-2 block">
        <Maximize2 className="inline w-4 h-4 mr-1" />
        Escala Global del Overlay
      </label>
      <div className="flex items-center space-x-2">
        <label className="text-xs text-gray-400">Tamaño:</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={globalScale}
          onChange={(e) => setGlobalScale(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs text-gray-400 w-12">
          {(globalScale * 100).toFixed(0)}%
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Ajusta el tamaño general del overlay para que se vea bien en OBS
      </div>
    </div>
  );
};

export default ScaleSettings;
