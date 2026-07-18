import { useState } from "react";
import { motion } from "framer-motion";

const MouseGlowCard = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-3xl border dark:border-gray-800 border-white/20 bg-white dark:bg-gray-900/60 p-8 shadow-2xl backdrop-blur-2xl"
    >
      {/* Mouse Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            300px circle at ${position.x}px ${position.y}px,
            rgba(99,102,241,.25),
            transparent 70%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default MouseGlowCard;