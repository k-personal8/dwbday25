import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../state/useProgress";
import { useAudio } from "../components/AudioController";
import { ProgressHUD } from "../components/ProgressHUD";
import rooms from "../content/rooms.json";
import memoriesData from "../content/memories.json";

export function MuseumLobby() {
  const navigate = useNavigate();
  const { progress, clearVisitedRooms } = useProgress();
  const { playSfx, setSceneMusic } = useAudio();

  useEffect(() => {
    setSceneMusic("museum");
  }, [setSceneMusic]);

  // Preload all gallery images in the background
  useEffect(() => {
    memoriesData.forEach((memory) => {
      const img = new Image();
      img.src = memory.image;
    });
  }, []);

  const allRoomIds = rooms.map((r) => r.id);
  const allGalleriesVisited = allRoomIds.every((id) => progress.visitedRooms.includes(id));

  const handleRoomClick = (roomId: string) => {
    playSfx("door");
    navigate(`/museum/${roomId}`);
  };

  const handleFinalExhibit = () => {
    playSfx("magic");
    navigate("/final");
  };

  const handleBackToMap = () => {
    clearVisitedRooms();
    navigate("/map");
  };

  return (
    <div className="scene museum-lobby">
      <div className="stars-bg" />
      <ProgressHUD artifacts={progress.collectedArtifacts} house={progress.house} />
      
      <motion.button
        className="back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBackToMap}
      >
        ← Back to Map
      </motion.button>

      <div className="lobby-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🏛️ The Museum of Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explore the galleries of our memories
        </motion.p>
      </div>

      <div className="rooms-grid">
        {rooms.map((room, index) => (
          <motion.button
            key={room.id}
            className={`room-card ${progress.visitedRooms.includes(room.id) ? "visited" : ""}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => handleRoomClick(room.id)}
            style={{ "--room-color": room.color } as React.CSSProperties}
          >
            <span className="room-icon">{room.icon}</span>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            {progress.visitedRooms.includes(room.id) && (
              <span className="visited-badge">✓ Visited</span>
            )}
          </motion.button>
        ))}
      </div>

      {allGalleriesVisited && (
        <motion.div
          className="final-exhibit-unlock"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="unlock-glow" />
          <h2>✨ A Special Exhibit Has Been Unlocked ✨</h2>
          <p>All galleries visited. The final treasure awaits...</p>
          
          <motion.button
            className="magic-btn gold"
            whileHover={{ scale: 1.05 }}
            onClick={handleFinalExhibit}
          >
            Enter the Final Exhibit 💝
          </motion.button>
        </motion.div>
      )}

      <motion.div
        className="lobby-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Click on a room to explore its memories</p>
      </motion.div>
    </div>
  );
}
