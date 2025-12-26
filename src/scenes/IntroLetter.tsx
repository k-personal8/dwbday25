import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../components/AudioController";
import { PasswordScreen } from "../components/PasswordScreen";

export function IntroLetter() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const { playSfx, setSceneMusic } = useAudio();

  useEffect(() => {
    if (isUnlocked) {
      setSceneMusic("main");
    }
  }, [setSceneMusic, isUnlocked]);

  const handleStart = () => {
    playSfx("page_turn");
    navigate("/sorting");
  };

  const handleUnlock = () => {
    playSfx("magic");
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return <PasswordScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="scene intro-letter">
      <div className="stars-bg" />
      
      <motion.div
        className="parchment"
        initial={{ opacity: 0, y: 50, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="wax-seal">🔮</div>
        
        <motion.div
          className="parchment-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="hogwarts-header">
            <span className="crest">⚡</span>
            Ministry of Magic
          </h1>
          
          <div className="letter-body">
            <p className="greeting">Dear Devanshi,</p>
            
            <p>
              You have been selected to visit the most magical show
              at <strong>Ken's World of Magic</strong>, a place where we find
              magic in the most unexpected places.
            </p>
            
            <p>
              Before you may enter, you must pass through a series of 
              enchanting challenge only <strong>Devanshi</strong> can pass. The Sorting Hat
              will determine your path...
            </p>
            
            <p>
              Complete the trials, collect the artifacts, and unlock the
              secret chambers that hold our greatest treasures.
            </p>
            
            <p className="closing">
              With love and magic,<br />
              <span className="signature">Your Secret Admirer ✨</span>
            </p>
          </div>
        </motion.div>

        <motion.button
          className="magic-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
        >
          <span className="btn-icon">✨</span>
          Begin Your Journey
        </motion.button>
      </motion.div>
    </div>
  );
}
