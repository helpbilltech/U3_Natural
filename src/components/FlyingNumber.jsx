import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FlyingNumber({ number, startPosition, endPosition, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 bg-[#d98893] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg"
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        opacity: 1,
        scale: 1
      }}
      animate={{
        x: endPosition.x,
        y: endPosition.y,
        opacity: 0,
        scale: 0.2
      }}
      transition={{
        duration: 1,
        ease: "easeOut"
      }}
      style={{
        left: 0,
        top: 0
      }}
    >
      +{number}
    </motion.div>
  );
}