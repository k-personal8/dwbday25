import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../state/useProgress";
import { useAudio } from "../components/AudioController";
import { ShadowBox } from "../components/ShadowBox";
import { FrameWall3x3 } from "../components/FrameWall3x3";
import { VisitorsRow } from "../components/VisitorsRow";
import { ProgressHUD } from "../components/ProgressHUD";
import { letterParagraphs, letterTitle } from "../content/letter";

export function FinalExhibit() {
  const [showLetter, setShowLetter] = useState(false);
  const [letterProgress, setLetterProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  
  const navigate = useNavigate();
  const { progress, revealLetter } = useProgress();
  const { playSfx, setSceneMusic } = useAudio();

  useEffect(() => {
    setSceneMusic("museum");
  }, [setSceneMusic]);

  const handleCastLumos = () => {
    if (isRevealing) return;
    
    playSfx("magic");
    setIsRevealing(true);
    setShowLetter(true);
    setHasOpenedBefore(true);
    revealLetter();

    let currentPara = 0;
    const interval = setInterval(() => {
      currentPara++;
      setLetterProgress(currentPara);
      
      if (currentPara >= letterParagraphs.length) {
        clearInterval(interval);
        setIsRevealing(false);
      }
    }, 800);
  };

  const handleCloseLetter = () => {
    setShowLetter(false);
    setLetterProgress(0);
    setIsRevealing(false);
  };

  const handleBackToLobby = () => {
    setShowLetter(false);
    setLetterProgress(0);
    setIsRevealing(false);
    setHasOpenedBefore(false);
    navigate("/museum");
  };

  const handleFrameClick = (slot: number) => {
    playSfx("click");
    console.log("Frame clicked:", slot);
  };

  return (
    <div className="scene final-exhibit">
      <div className="stars-bg" />
      <ProgressHUD artifacts={progress.collectedArtifacts} house={progress.house} />
      
      <motion.button
        className="back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBackToLobby}
      >
        ← Back to Lobby
      </motion.button>

      <motion.div
        className="exhibit-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>✨ The Final Exhibit ✨</h1>
        <p>Our most treasured moments, preserved forever</p>
      </motion.div>

      <div className="exhibit-content">
        <ShadowBox>
          <FrameWall3x3 onFrameClick={handleFrameClick} />
          <VisitorsRow />
        </ShadowBox>
      </div>

      <AnimatePresence>
        {!showLetter && (
          <motion.div
            className="letter-unlock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: hasOpenedBefore ? 0 : 2 }}
          >
            <p className="unlock-hint">A hidden message awaits...</p>
            <motion.button
              className="magic-btn lumos-btn"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 215, 0, 0.6)" }}
              onClick={handleCastLumos}
            >
              <span className="wand">✨</span>
              Cast Lumos
              <span className="wand">✨</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLetter && (
          <motion.div
            className="letter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="letter-parchment"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button 
                className="letter-close"
                onClick={handleCloseLetter}
              >
                ×
              </button>

              <h2 className="letter-title">{letterTitle}</h2>
              
              <div className="letter-content">
                {letterParagraphs.map((para, index) => {
                  const isVisible = hasOpenedBefore || index < letterProgress;
                  return (
                    <motion.p
                      key={index}
                      className={`letter-paragraph ${para === "" ? "spacer" : ""}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 10
                      }}
                      transition={{ duration: hasOpenedBefore ? 0 : 0.5 }}
                    >
                      {para}
                    </motion.p>
                  );
                })}
              </div>

              {(hasOpenedBefore || letterProgress >= letterParagraphs.length) && (
                <motion.div
                  className="letter-footer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: hasOpenedBefore ? 0 : 0.5, delay: hasOpenedBefore ? 0 : 0.5 }}
                >
                  <div className="heart-decoration">💕</div>
                  <p>Happy Birthday, Devanshi!</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
