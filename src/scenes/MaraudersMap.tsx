import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../state/useProgress";
import { useAudio } from "../components/AudioController";

interface Hotspot {
  id: string;
  name: string;
  emoji: string;
  x: string;
  y: string;
  hint: string;
}

const hotspots: Hotspot[] = [
  { id: "artifact1", name: "Bowling", emoji: "🎳", x: "25%", y: "30%", hint: "Strike!" },
  { id: "artifact2", name: "Gelato", emoji: "🍨", x: "70%", y: "45%", hint: "Sweet memories" },
  { id: "artifact3", name: "Balloons", emoji: "🎈", x: "45%", y: "70%", hint: "Floating with joy" },
];

export function MaraudersMap() {
  const [foundArtifacts, setFoundArtifacts] = useState<string[]>([]);
  const [showingHint, setShowingHint] = useState<string | null>(null);
  const [mapRevealed, setMapRevealed] = useState(false);
  
  const navigate = useNavigate();
  const { collectArtifact, unlockScene } = useProgress();
  const { playSfx, setSceneMusic } = useAudio();

  useEffect(() => {
    setSceneMusic("main");
  }, [setSceneMusic]);

  const handleRevealMap = () => {
    playSfx("magic");
    setMapRevealed(true);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (foundArtifacts.includes(hotspot.id)) return;
    
    playSfx("sparkle");
    setFoundArtifacts([...foundArtifacts, hotspot.id]);
    collectArtifact(hotspot.id);

    if (foundArtifacts.length + 1 >= 3) {
      unlockScene("museum");
      playSfx("magic");
    }
  };

  const handleContinue = () => {
    playSfx("whoosh");
    navigate("/museum");
  };

  const allFound = foundArtifacts.length >= 3;

  return (
    <div className="scene marauders-map">
      <motion.button
        className="back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/lumos")}
      >
        ← Back
      </motion.button>

      <div className="parchment-bg" />

      <AnimatePresence mode="wait">
        {!mapRevealed ? (
          <motion.div
            key="closed"
            className="map-closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="folded-map">📜</div>
            <h2>The Marauder's Map</h2>
            <p>Speak the magic words to reveal its secrets...</p>
            
            <motion.button
              className="magic-btn"
              whileHover={{ scale: 1.05 }}
              onClick={handleRevealMap}
            >
              "I solemnly swear that I am up to no good"
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            className="map-open"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="map-header">
              <h1>🗺️ The Marauder's Map</h1>
              <p>Find the three hidden artifacts to unlock the Chamber of Great Treasures</p>
            </div>

            <div className="artifact-tracker">
              {hotspots.map((h) => (
                <div 
                  key={h.id}
                  className={`artifact-slot ${foundArtifacts.includes(h.id) ? "found" : ""}`}
                  onMouseEnter={() => setShowingHint(h.id)}
                  onMouseLeave={() => setShowingHint(null)}
                >
                  {foundArtifacts.includes(h.id) ? h.emoji : "?"}
                  {showingHint === h.id && !foundArtifacts.includes(h.id) && (
                    <span className="hint-tooltip">{h.hint}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="map-canvas">
              <div className="map-paths">
                <svg viewBox="0 0 100 100" className="paths-svg">
                  <path d="M10,50 Q30,20 50,50 T90,50" className="path-line" />
                  <path d="M50,10 Q80,30 50,50 T50,90" className="path-line" />
                  <path d="M20,80 Q40,60 60,70 T80,20" className="path-line" />
                </svg>
              </div>

              {hotspots.map((hotspot) => (
                <motion.button
                  key={hotspot.id}
                  className={`map-hotspot ${foundArtifacts.includes(hotspot.id) ? "found" : ""}`}
                  style={{ left: hotspot.x, top: hotspot.y }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    scale: foundArtifacts.includes(hotspot.id) ? 1.2 : [1, 1.1, 1],
                  }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 2 }
                  }}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => handleHotspotClick(hotspot)}
                >
                  {foundArtifacts.includes(hotspot.id) ? (
                    <span className="artifact-found">{hotspot.emoji}</span>
                  ) : (
                    <span className="footprints">👣</span>
                  )}
                  {foundArtifacts.includes(hotspot.id) && (
                    <span className="artifact-name">{hotspot.name}</span>
                  )}
                </motion.button>
              ))}

              <div className="map-decorations">
                <span className="decoration" style={{ left: "10%", top: "20%" }}>🏰</span>
                <span className="decoration" style={{ left: "85%", top: "15%" }}>🌲</span>
                <span className="decoration" style={{ left: "15%", top: "75%" }}>⚡</span>
                <span className="decoration" style={{ left: "80%", top: "80%" }}>🦉</span>
              </div>
            </div>

            <AnimatePresence>
              {allFound && (
                <motion.div
                  className="map-complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2>🎉 All Artifacts Collected!</h2>
                  <p>The Museum of Us is now unlocked...</p>
                  
                  <motion.button
                    className="magic-btn gold"
                    whileHover={{ scale: 1.05 }}
                    onClick={handleContinue}
                  >
                    Enter the Museum 🏛️
                  </motion.button>

                  <button 
                    className="text-btn"
                    onClick={() => {
                      playSfx("page_turn");
                      setMapRevealed(false);
                    }}
                  >
                    "Mischief Managed"
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
