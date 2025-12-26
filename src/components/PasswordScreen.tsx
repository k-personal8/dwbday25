import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = "dwkc";

export function PasswordScreen({ onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.toLowerCase() === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="password-screen">
      <div className="stars-bg" />
      
      <div className="password-container">
        <div className="password-icon">🔮</div>
        <h1>Welcome to Ken's World of Magic,</h1>
        <p>Speak the secret words to enter...</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password..."
            autoFocus
          />
          <motion.button
            type="submit"
            className="magic-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✨ Enter ✨
          </motion.button>
        </form>
        
        {error && (
          <p className="error-message">
            Incorrect password. Try again...
          </p>
        )}
      </div>
    </div>
  );
}
