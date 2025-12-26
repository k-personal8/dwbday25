import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../state/useProgress";
import { useAudio } from "../components/AudioController";

const STAR_COUNT = 5;
const TARGET_SEQUENCE = [2, 0, 4, 1, 3];

export function LumosHall() {
  const [litStars, setLitStars] = useState<number[]>([]);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const navigate = useNavigate();
  const { unlockScene } = useProgress();
  const { playSfx, setSceneMusic } = useAudio();

  useEffect(() => {
    setSceneMusic("main");
  }, [setSceneMusic]);

  useEffect(() => {
    if (attempts >= 3 && !showHint) {
      setShowHint(true);
    }
  }, [attempts, showHint]);

  const handleStarClick = (index: number) => {
    if (isComplete) return;
    
    const newSequence = [...clickSequence, index];
    setClickSequence(newSequence);
    setLitStars([...litStars, index]);
    playSfx("sparkle");

    if (newSequence.length === TARGET_SEQUENCE.length) {
      const isCorrect = newSequence.every((val, i) => val === TARGET_SEQUENCE[i]);
      
      if (isCorrect) {
        setIsComplete(true);
        playSfx("magic");
        unlockScene("map");
      } else {
        setAttempts(attempts + 1);
        playSfx("error");
        setTimeout(() => {
          setLitStars([]);
          setClickSequence([]);
        }, 500);
      }
    }
  };

  const handleContinue = () => {
    playSfx("whoosh");
    navigate("/map");
  };

  const starPositions = [
    { top: "20%", left: "20%" },
    { top: "15%", left: "50%" },
    { top: "25%", left: "80%" },
    { top: "50%", left: "35%" },
    { top: "45%", left: "65%" },
  ];

  return (
    <div className="scene lumos-hall">
      <motion.button
        className="back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/sorting")}
      >
        ← Back
      </motion.button>

      <div className={`hall-darkness ${isComplete ? "lights-on" : ""}`} />
      
      <div className="hall-content">
        <motion.h1
          className="lumos-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✨ Lumos Hall ✨
        </motion.h1>

        <motion.p
          className="lumos-instructions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isComplete 
            ? "Brilliant! The hall is illuminated!" 
            : "Light the stars in the correct order to illuminate the path..."}
        </motion.p>

        {showHint && !isComplete && (
          <motion.p
            className="lumos-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            💡 Hint: Start from the middle-left, then top-center...
          </motion.p>
        )}

        <div className="stars-container">
          {Array.from({ length: STAR_COUNT }).map((_, i) => (
            <motion.button
              key={i}
              className={`star ${litStars.includes(i) ? "lit" : ""}`}
              style={starPositions[i]}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleStarClick(i)}
              disabled={isComplete || litStars.includes(i)}
            >
              {litStars.includes(i) ? "⭐" : "☆"}
              {showHint && !isComplete && (
                <span className="star-number">{TARGET_SEQUENCE.indexOf(i) + 1}</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="sequence-display">
          {Array.from({ length: STAR_COUNT }).map((_, i) => (
            <span 
              key={i} 
              className={`sequence-dot ${clickSequence[i] !== undefined ? "filled" : ""}`}
            >
              {clickSequence[i] !== undefined ? "★" : "○"}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="lumos-success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="success-glow" />
              <h2>🌟 Lumos Maxima! 🌟</h2>
              <p>You've proven your magical abilities. The Marauder's Map awaits...</p>
              
              <motion.button
                className="magic-btn"
                whileHover={{ scale: 1.05 }}
                onClick={handleContinue}
              >
                Explore the Map 🗺️
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
