import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useProgress } from "../state/useProgress";
import { useAudio } from "../components/AudioController";
import { OrnateFrame } from "../components/OrnateFrame";
import { MemoryModal } from "../components/MemoryModal";
import { ProgressHUD } from "../components/ProgressHUD";
import rooms from "../content/rooms.json";
import memoriesData from "../content/memories.json";

interface Memory {
  id: string;
  roomId: string;
  title: string;
  date: string;
  caption: string;
  image: string;
}

export function MuseumRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { progress, visitRoom, visitMemory } = useProgress();
  const { playSfx, setSceneMusic } = useAudio();
  
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const room = rooms.find((r) => r.id === roomId);
  const memories = memoriesData.filter((m) => m.roomId === roomId) as Memory[];

  useEffect(() => {
    setSceneMusic("museum");
  }, [setSceneMusic]);

  useEffect(() => {
    if (roomId) {
      visitRoom(roomId);
    }
  }, [roomId, visitRoom]);

  const handleMemoryClick = (memory: Memory) => {
    playSfx("click");
    setSelectedMemory(memory);
    visitMemory(memory.id);
  };

  const handleCloseModal = () => {
    setSelectedMemory(null);
  };

  const handleNextMemory = () => {
    if (!selectedMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % memories.length;
    setSelectedMemory(memories[nextIndex]);
    visitMemory(memories[nextIndex].id);
    playSfx("page_turn");
  };

  const handlePrevMemory = () => {
    if (!selectedMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
    setSelectedMemory(memories[prevIndex]);
    visitMemory(memories[prevIndex].id);
    playSfx("page_turn");
  };

  if (!room) {
    return (
      <div className="scene museum-room">
        <p>Room not found</p>
        <button onClick={() => navigate("/museum")}>Back to Lobby</button>
      </div>
    );
  }

  return (
    <div className="scene museum-room" style={{ "--room-color": room.color } as React.CSSProperties}>
      <div className="stars-bg" />
      <ProgressHUD artifacts={progress.collectedArtifacts} house={progress.house} />
      
      <motion.button
        className="back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/museum")}
      >
        ← Back to Lobby
      </motion.button>

      <div className="room-header">
        <motion.span
          className="room-icon-large"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          {room.icon}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {room.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {room.description}
        </motion.p>
      </div>

      <div className="memories-gallery">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            className="memory-frame-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <OrnateFrame
              image={memory.image}
              frameType={index % 2 === 0 ? "rect" : "oval"}
              onClick={() => handleMemoryClick(memory)}
              size="large"
            />
            <p className="memory-title">{memory.title}</p>
          </motion.div>
        ))}
      </div>

      <MemoryModal
        memory={selectedMemory}
        onClose={handleCloseModal}
        onNext={handleNextMemory}
        onPrev={handlePrevMemory}
      />
    </div>
  );
}
