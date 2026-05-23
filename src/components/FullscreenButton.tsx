import React, { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", checkFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
    };
  }, []);

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen permission denied:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  };

  return (
    <button
      onClick={handleToggleFullscreen}
      className="mx-auto inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-black text-gray-300 border border-white/15 hover:border-orange-500/40 hover:text-white bg-gray-950/80 hover:bg-orange-500/10 transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_15px_rgba(249,115,22,0.15)] shrink-0"
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>退出全螢幕</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>🖥️ 進入全螢幕</span>
        </>
      )}
    </button>
  );
}
