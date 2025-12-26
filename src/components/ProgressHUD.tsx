import { motion } from "framer-motion";
import { useAudio } from "./AudioController";

interface Props {
  artifacts: string[];
  house?: string;
}

const artifactEmojis: Record<string, string> = {
  artifact1: "🎳",
  artifact2: "🍨",
  artifact3: "🎈",
};

const artifactOrder = ["artifact1", "artifact2", "artifact3"];

export function ProgressHUD({ artifacts, house }: Props) {
  const { toggleMute, isMuted } = useAudio();

  return (
    <motion.div
      className="progress-hud"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {house && (
        <div className={`house-badge ${house}`}>
          <span className="house-icon">⚡</span>
          <span className="house-name">{house}</span>
        </div>
      )}
      
      <div className="artifacts-display">
        {artifactOrder.map((artifactId, i) => {
          const isCollected = artifacts.includes(artifactId);
          return (
            <div
              key={i}
              className={`artifact-slot ${isCollected ? "collected" : ""}`}
            >
              {isCollected ? artifactEmojis[artifactId] : "○"}
            </div>
          );
        })}
      </div>

      <button className="mute-btn" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>
    </motion.div>
  );
}
