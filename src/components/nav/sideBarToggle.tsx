'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../store/sidebarStore';

export default function SidebarToggle() {
  const { isOpen, setIsOpen } = useSidebarStore();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-[#111820] rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}