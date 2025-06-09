import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnimationToggleProps {
  showAnimation: boolean;
  setShowAnimation: (show: boolean) => void;
}

const AnimationToggle: React.FC<AnimationToggleProps> = ({
  showAnimation,
  setShowAnimation
}) => {
  return (
    <div className="mb-6">
      <label className="flex items-center text-sm text-gray-400">
        <input
          type="checkbox"
          checked={showAnimation}
          onChange={(e) => setShowAnimation(e.target.checked)}
          className="mr-2"
        />
        <Sparkles className="inline w-4 h-4 mr-1" />
        Mostrar animación de galaxia
      </label>
    </div>
  );
};

export default AnimationToggle;