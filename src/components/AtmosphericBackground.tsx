import React from 'react';
import { motion } from 'motion/react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-pink-200/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[5%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[10%] -right-[5%] w-[55%] h-[55%] rounded-full bg-blue-200/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[5%] -left-[10%] w-[45%] h-[45%] rounded-full bg-yellow-100/30 blur-[120px]"
      />
    </div>
  );
};
