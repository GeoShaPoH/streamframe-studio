// src/components/UrlInfo.tsx
import React, { useState } from "react";
import { Copy, Check, Info, X } from "lucide-react";

interface UrlInfoProps {
  theme: any;
}

const UrlInfo: React.FC<UrlInfoProps> = ({ theme }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [copiedUrls, setCopiedUrls] = useState<{ [key: string]: boolean }>({});

  const baseUrl = window.location.origin;

  const urls = [
    {
      name: "URL del Editor",
      url: baseUrl,
      description: "URL completa con controles de configuración",
      icon: "🎨",
    },
    {
      name: "URL del Viewer",
      url: `${baseUrl}?viewer=true`,
      description: "URL para OBS sin controles visibles",
      icon: "👁️",
    },
    {
      name: "URL Solo Frame",
      url: `${baseUrl}?hideControls=true&hideIndicator=true`,
      description: "Solo el frame, sin ningún control",
      icon: "🖼️",
    },
  ];

  const copyUrl = (key: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrls({ ...copiedUrls, [key]: true });
      setTimeout(() => {
        setCopiedUrls((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  if (!showInfo) {
    return (
      <button
        onClick={() => setShowInfo(true)}
        className="p-2 rounded-lg pointer-events-auto transition-all hover:scale-110"
        style={{
          background: `${theme.primary}20`,
          border: `1px solid ${theme.primary}40`,
        }}
        title="Información de URLs"
      >
        <Info className="w-6 h-6" style={{ color: theme.primary }} />
      </button>
    );
  }

  return (
    <div
      className="absolute top-16 right-4 w-96 p-4 rounded-lg shadow-xl pointer-events-auto"
      style={{
        background: `rgba(0, 0, 0, 0.9)`,
        border: `1px solid ${theme.primary}40`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: theme.primary }}>
          URLs Disponibles
        </h3>
        <button
          onClick={() => setShowInfo(false)}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" style={{ color: theme.primary }} />
        </button>
      </div>

      <div className="space-y-3">
        {urls.map((item) => (
          <div
            key={item.name}
            className="p-3 rounded-lg transition-all hover:bg-white/5"
            style={{
              background: `${theme.primary}10`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-white">{item.name}</span>
              </div>
              <button
                onClick={() => copyUrl(item.name, item.url)}
                className="p-1.5 rounded hover:bg-white/10 transition-all"
                style={{ color: theme.primary }}
              >
                {copiedUrls[item.name] ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">{item.description}</p>
            <code className="text-xs text-gray-500 break-all">{item.url}</code>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300">
          <strong>Tip:</strong> Usa la URL del Viewer en OBS para ocultar
          automáticamente todos los controles. El frame se sincronizará en
          tiempo real con el editor.
        </p>
      </div>
    </div>
  );
};

export default UrlInfo;
