import { useLocation } from "react-router-dom";
import { useAudio } from "./AudioController";

const earlyScenes = ["/", "/sorting", "/lumos", "/map"];

export function GlobalAudioControl() {
  const location = useLocation();
  const { isMuted, toggleMute, setSceneMusic } = useAudio();

  // Hide on gallery pages and later (ProgressHUD has its own mute button)
  if (!earlyScenes.includes(location.pathname)) {
    return null;
  }

  const handleClick = () => {
    if (isMuted) {
      // When unmuting, start the appropriate music based on current route
      const isMuseumOrFinal = location.pathname.startsWith("/museum") || location.pathname === "/final";
      setSceneMusic(isMuseumOrFinal ? "museum" : "main");
    }
    toggleMute();
  };

  return (
    <button 
      className="global-audio-btn"
      onClick={handleClick}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? "🔇 Click for Music" : "🔊"}
    </button>
  );
}
