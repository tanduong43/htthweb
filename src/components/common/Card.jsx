import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  glow = 'gold', // 'gold' | 'cyan' | 'crimson' | 'none'
  style = {},
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4 } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`pirate-card glow-${glow} ${className}`}
      style={style}
      {...props}
    >
      <div className="card-corner corner-tl"></div>
      <div className="card-corner corner-tr"></div>
      <div className="card-corner corner-bl"></div>
      <div className="card-corner corner-br"></div>
      <div className="card-inner-glow"></div>
      {children}
    </motion.div>
  );
}
