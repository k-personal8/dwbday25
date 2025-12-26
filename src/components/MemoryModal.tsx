import { motion, AnimatePresence } from "framer-motion";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  image: string;
  cropPosition?: string;
}

interface Props {
  memory: Memory | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function MemoryModal({ memory, onClose, onNext, onPrev }: Props) {
  if (!memory) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="memory-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="memory-modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>×</button>
          
          <div className="memory-modal-content">
            <div className="memory-image-container">
              <img 
                src={memory.image} 
                alt={memory.title}
                style={memory.cropPosition ? { objectPosition: `center ${memory.cropPosition}` } : undefined}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            
            <div className="memory-details">
              <h2>{memory.title}</h2>
              <p className="memory-date">{(() => {
                const [year, month, day] = memory.date.split('-').map(Number);
                return new Date(year, month - 1, day).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
              })()}</p>
              <p className="memory-caption">{memory.caption}</p>
            </div>
          </div>

          <div className="memory-nav">
            {onPrev && (
              <button className="nav-btn prev" onClick={onPrev}>← Previous</button>
            )}
            {onNext && (
              <button className="nav-btn next" onClick={onNext}>Next →</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
