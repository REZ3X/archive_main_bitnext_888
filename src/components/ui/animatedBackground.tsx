'use client';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#111828]">
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0.5 }}
        animate={{ 
          background: [
            'radial-gradient(circle at 0% 0%, #1c2434 0%, #111828 50%, #111828 100%)',
            'radial-gradient(circle at 100% 100%, #1c2434 0%, #111828 50%, #111828 100%)',
            'radial-gradient(circle at 0% 100%, #1c2434 0%, #111828 50%, #111828 100%)',
            'radial-gradient(circle at 100% 0%, #1c2434 0%, #111828 50%, #111828 100%)',
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(17, 24, 40, 0.8) 100%)',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
}