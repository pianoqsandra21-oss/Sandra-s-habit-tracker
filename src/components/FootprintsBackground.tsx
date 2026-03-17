import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Footprint {
  id: number;
  x: number;
  y: number;
}

export const FootprintsBackground: React.FC = () => {
  const [footprints, setFootprints] = useState<Footprint[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const stepSize = 100;
    const startY = window.innerHeight * 0.65;
    
    const interval = setInterval(() => {
      setFootprints((prev) => {
        // Keep only the last few footprints for a trailing effect
        const newFootprints = prev.length > 8 ? prev.slice(1) : prev;
        
        // Calculate X position moving from left to right
        // Reset when it goes off screen
        const x = (idCounter * stepSize) % (window.innerWidth + stepSize);
        
        // If we just reset, we can slightly vary Y or just keep it consistent
        const y = startY + (Math.sin(idCounter * 0.8) * 15);

        const newStep: Footprint = {
          id: idCounter++,
          x: x - 50, // Offset to start slightly off-screen
          y: y
        };

        return [...newFootprints, newStep];
      });
    }, 1000); // Faster interval (1s)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {footprints.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "linear" }} // Faster duration (1s)
            style={{
              position: 'absolute',
              left: step.x,
              top: step.y,
              rotate: '-90deg', // Toes facing right
            }}
          >
            <FootprintIcon />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const FootprintIcon = () => (
  <svg width="24" height="40" viewBox="0 0 24 40" fill="currentColor" className="text-stone-400">
    {/* A single unified footprint shape */}
    <path d="M12,0 C18.627417,0 24,5.372583 24,12 C24,18.627417 18.627417,24 12,24 C5.372583,24 0,18.627417 0,12 C0,5.372583 5.372583,0 12,0 Z M6,32 C7.65685425,32 9,33.3431458 9,35 C9,36.6568542 7.65685425,38 6,38 C4.34314575,38 3,36.6568542 3,35 C3,33.3431458 4.34314575,32 6,32 Z M12,34 C13.6568542,34 15,35.3431458 15,37 C15,38.6568542 13.6568542,40 12,40 C10.3431458,40 9,38.6568542 9,37 C9,35.3431458 10.3431458,34 12,34 Z M18,32 C19.6568542,32 21,33.3431458 21,35 C21,36.6568542 19.6568542,38 18,38 C16.3431458,38 15,36.6568542 15,35 C15,33.3431458 16.3431458,32 18,32 Z" />
  </svg>
);
