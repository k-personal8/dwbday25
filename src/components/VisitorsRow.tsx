import { motion } from "framer-motion";

export function VisitorsRow() {
  return (
    <motion.div
      className="visitors-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <div className="visitors-ledge" />
      <div className="visitors-figures">
        <motion.span
          className="visitor couple"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          👫
        </motion.span>
      </div>
    </motion.div>
  );
}
