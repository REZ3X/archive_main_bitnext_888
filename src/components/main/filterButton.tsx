'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterButtonProps {
  options: FilterOption[];
  onFilter: (option: string | null) => void;
}

export default function FilterButton({ options, onFilter }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterSelect = (optionId: string) => {
    setSelectedFilter(optionId === selectedFilter ? null : optionId);
    onFilter(optionId === selectedFilter ? null : optionId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-[#3d4753] text-[#ffffff] rounded-lg flex items-center space-x-2
        hover:bg-[#4a5563] transition-colors duration-200"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filter</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-48 rounded-lg bg-[#3d4753] shadow-lg py-1
            border border-[#111820]/20"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleFilterSelect(option.id)}
                className={`w-full px-4 py-2 text-left text-[#ffffff] hover:bg-[#4a5563] 
                transition-colors duration-200 ${
                  selectedFilter === option.id ? 'bg-[#111820]' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}