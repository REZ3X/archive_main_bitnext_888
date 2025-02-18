'use client';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111828]"
    >
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 1] }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-24 h-24">
            <motion.div
              className="absolute inset-0 border-4 border-[#facc16] rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-[#facc16]/30 rounded-full"
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[#facc16] text-xl font-bold"
        >
          ArcHive Cloud Notes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[#ffffff]/60 text-sm"
        >
          Loading your workspace...
        </motion.p>
      </div>
    </motion.div>
  );
}