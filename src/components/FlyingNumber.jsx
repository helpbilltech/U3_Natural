import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function FlyingNumber({ 
  number, 
  startPosition, 
  endPosition, 
  onComplete 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        left: startPosition.x,
        top: startPosition.y,
      }}
      initial={{ 
        scale: 0.8,
        opacity: 1,
        x: 0,
        y: 0
      }}
      animate={{ 
        scale: [0.8, 1.2, 1],
        opacity: [1, 1, 0],
        x: endPosition.x - startPosition.x,
        y: endPosition.y - startPosition.y
      }}
      transition={{ 
        duration: 0.8,
        ease: "easeOut",
        times: [0, 0.3, 1]
      }}
    >
      <motion.div
        className="bg-[var(--rose-500)] text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        {number}
      </motion.div>
    </motion.div>
  );
}
