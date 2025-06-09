import React from "react";
import { Image, Upload } from "lucide-react";

interface AvatarSettingsProps {
  showAvatar: boolean;
  setShowAvatar: (show: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSettings: React.FC<AvatarSettingsProps> = ({
  showAvatar,
  setShowAvatar,
  fileInputRef,
  handleImageUpload,
}) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-300 mb-2 block">
        <Image className="inline w-4 h-4 mr-1" />
        Avatar de personaje
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir imagen
        </button>
        <label className="flex items-center text-sm text-gray-400">
          <input
            type="checkbox"
            checked={showAvatar}
            onChange={(e) => setShowAvatar(e.target.checked)}
            className="mr-2"
          />
          Mostrar avatar
        </label>
      </div>
      <div className="text-xs text-gray-500">
        La imagen se guardará en el servidor para sincronización entre
        dispositivos
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default AvatarSettings;
