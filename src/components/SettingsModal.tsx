import React, { useRef } from "react";
import { X } from "lucide-react";
import ThemeSelector from "./settings/ThemeSelector";
import NameSettings from "./settings/NameSettings";
import FontSettings from "./settings/FontSettings";
import AvatarSettings from "./settings/AvatarSettings";
import AnimationToggle from "./settings/AnimationToggle";
import ScaleSettings from "./settings/ScaleSettings";
import { ThemeName } from "../App";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  setCurrentTheme: (theme: ThemeName) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  namePosition: string;
  setNamePosition: (position: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  showAvatar: boolean;
  setShowAvatar: (show: boolean) => void;
  avatarImage: string | ArrayBuffer | null;
  setAvatarImage: (image: string | ArrayBuffer | null) => void;
  showAnimation: boolean;
  setShowAnimation: (show: boolean) => void;
  globalScale: number;
  setGlobalScale: (scale: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  setCurrentTheme,
  customColor,
  setCustomColor,
  playerName,
  setPlayerName,
  namePosition,
  setNamePosition,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  showAvatar,
  setShowAvatar,
  avatarImage,
  setAvatarImage,
  showAnimation,
  setShowAnimation,
  globalScale,
  setGlobalScale,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          Configuración del Marco
        </h2>

        <ScaleSettings
          globalScale={globalScale}
          setGlobalScale={setGlobalScale}
        />

        <ThemeSelector
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          customColor={customColor}
          setCustomColor={setCustomColor}
        />

        <NameSettings
          playerName={playerName}
          setPlayerName={setPlayerName}
          namePosition={namePosition}
          setNamePosition={setNamePosition}
        />

        <FontSettings
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />

        <AvatarSettings
          showAvatar={showAvatar}
          setShowAvatar={setShowAvatar}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
        />

        <AnimationToggle
          showAnimation={showAnimation}
          setShowAnimation={setShowAnimation}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
