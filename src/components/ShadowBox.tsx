import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ShadowBox({ children }: Props) {
  return (
    <motion.div
      className="shadowbox"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="shadowbox-inner">
        {children}
      </div>
    </motion.div>
  );
}
