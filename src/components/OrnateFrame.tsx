import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  image: string;
  frameType: "rect" | "oval" | "special";
  onClick?: () => void;
  delay?: number;
  size?: "small" | "medium" | "large";
}

export function OrnateFrame({ image, frameType, onClick, delay = 0, size = "medium" }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    small: "ornate-frame-small",
    medium: "ornate-frame-medium",
    large: "ornate-frame-large",
  };

  return (
    <motion.div
      className={`ornate-frame ${frameType} ${sizeClasses[size]}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
      transition={{ delay: isLoaded ? delay : 0, duration: 0.5, ease: "easeOut" }}
      whileHover={isLoaded ? { scale: 1.05, boxShadow: "0 8px 25px rgba(212, 175, 55, 0.4)" } : {}}
      onClick={onClick}
    >
      <div className="frame-inner">
        <img 
          src={image} 
          alt="Memory" 
          className="frame-photo loaded"
          loading="eager"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      </div>
      <div className="frame-border" />
    </motion.div>
  );
}
