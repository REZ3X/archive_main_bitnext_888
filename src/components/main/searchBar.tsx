'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md"
    >
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search notes..."
        className="w-full px-4 py-2 bg-[#111820] text-[#ffffff] rounded-lg 
        border border-[#3d4753] focus:outline-none focus:border-[#facc16] 
        transition-all duration-200 placeholder:text-[#ffffff]/50"
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ffffff]/50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </motion.div>
  );
}