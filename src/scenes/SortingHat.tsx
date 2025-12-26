import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../state/useProgress";
import { useAudio } from "../components/AudioController";
import type { House } from "../state/progress";

interface Question {
  question: string;
  answers: { text: string; house: House }[];
}

const questions: Question[] = [
  {
    question: "When facing a challenge, you prefer to...",
    answers: [
      { text: "Charge ahead bravely", house: "gryffindor" },
      { text: "Think it through carefully", house: "ravenclaw" },
      { text: "Work with others as a team", house: "hufflepuff" },
      { text: "Find the clever shortcut", house: "slytherin" },
    ],
  },
  {
    question: "Your ideal date night would be...",
    answers: [
      { text: "An exciting adventure", house: "gryffindor" },
      { text: "A cozy bookstore visit", house: "ravenclaw" },
      { text: "Cooking dinner together", house: "hufflepuff" },
      { text: "A fancy dinner out", house: "slytherin" },
    ],
  },
  {
    question: "What quality do you value most in a partner?",
    answers: [
      { text: "Courage and passion", house: "gryffindor" },
      { text: "Intelligence and wit", house: "ravenclaw" },
      { text: "Loyalty and kindness", house: "hufflepuff" },
      { text: "Ambition and drive", house: "slytherin" },
    ],
  },
  {
    question: "Pick a magical artifact:",
    answers: [
      { text: "The Sword of Gryffindor", house: "gryffindor" },
      { text: "Rowena's Diadem", house: "ravenclaw" },
      { text: "Helga's Cup", house: "hufflepuff" },
      { text: "Slytherin's Locket", house: "slytherin" },
    ],
  },
  {
    question: "What matters most to you?",
    answers: [
      { text: "Making memories together", house: "gryffindor" },
      { text: "Understanding each other deeply", house: "ravenclaw" },
      { text: "Always being there for each other", house: "hufflepuff" },
      { text: "Building a future together", house: "slytherin" },
    ],
  },
];

export function SortingHat() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<House, number>>({
    gryffindor: 0,
    ravenclaw: 0,
    hufflepuff: 0,
    slytherin: 0,
  });
  const [sortedHouse, setSortedHouse] = useState<House | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  
  const navigate = useNavigate();
  const { setHouse } = useProgress();
  const { playSfx, setSceneMusic } = useAudio();

  useEffect(() => {
    setSceneMusic("main");
  }, [setSceneMusic]);

  const handleAnswer = (house: House) => {
    playSfx("click");
    const newScores = { ...scores, [house]: scores[house] + 1 };
    setScores(newScores);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setIsThinking(true);
      setTimeout(() => {
        const winner = (Object.entries(newScores) as [House, number][])
          .sort((a, b) => b[1] - a[1])[0][0];
        setSortedHouse(winner);
        setHouse(winner);
        playSfx("magic");
      }, 2000);
    }
  };

  const handleContinue = () => {
    playSfx("whoosh");
    navigate("/lumos");
  };

  return (
    <div className="scene sorting-hat">
      <motion.button
        className="back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
      >
        ← Back
      </motion.button>

      <div className="magic-particles" />
      
      <AnimatePresence mode="wait">
        {!sortedHouse && !isThinking && (
          <motion.div
            key={`question-${currentQ}`}
            className="sorting-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="hat-icon">🎩</div>
            
            <div className="progress-dots">
              {questions.map((_, i) => (
                <span 
                  key={i} 
                  className={`dot ${i === currentQ ? "active" : ""} ${i < currentQ ? "done" : ""}`}
                />
              ))}
            </div>

            <h2 className="sorting-question">{questions[currentQ].question}</h2>

            <div className="answers-grid">
              {questions[currentQ].answers.map((answer, i) => (
                <motion.button
                  key={i}
                  className="answer-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(answer.house)}
                >
                  {answer.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {isThinking && !sortedHouse && (
          <motion.div
            key="thinking"
            className="sorting-thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="hat-thinking">🎩</div>
            <p>Hmm, difficult... very difficult...</p>
            <div className="thinking-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </motion.div>
        )}

        {sortedHouse && (
          <motion.div
            key="result"
            className={`sorting-result ${sortedHouse}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="house-crest">
              {sortedHouse === "gryffindor" && "🦁"}
              {sortedHouse === "ravenclaw" && "🦅"}
              {sortedHouse === "hufflepuff" && "🦡"}
              {sortedHouse === "slytherin" && "🐍"}
            </div>
            
            <h1 className="house-announcement">
              {sortedHouse.toUpperCase()}!
            </h1>
            
            <p className="house-message">
              {sortedHouse === "gryffindor" && "Where dwell the brave at heart!"}
              {sortedHouse === "ravenclaw" && "Where those of wit and learning will always find their kind!"}
              {sortedHouse === "hufflepuff" && "Where they are just and loyal!"}
              {sortedHouse === "slytherin" && "Where you'll make your real friends!"}
            </p>

            <motion.button
              className="magic-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleContinue}
            >
              Continue to Lumos Hall ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
