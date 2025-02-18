"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "../store/sidebarStore";
import { useUserStore } from "../store/userStore";
import { useState, useEffect, useRef } from "react";
import LogoutButton from "../main/logOutButton";

export default function Header() {
  const { isOpen, setIsOpen } = useSidebarStore();
  const { username, setUsername } = useUserStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/getProfile");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchUserData();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setUsername]);

  return (
    <nav className="bg-[#3d4753] p-4 fixed top-0 right-0 left-0 z-20 header-nav">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-[#111820] rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-[#ffffff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
          )}
          <div className="flex items-center">
            <motion.h1 
              className="text-[#facc16] text-xl font-bold"
              animate={{ 
                marginLeft: isOpen ? "300px" : "0px" 
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              ArcHive Cloud Notes
              <span className="ml-2 text-xs font-medium text-[#ffffff]/60 bg-[#111820] px-2 py-0.5 rounded-full">
                v0.1 Alpha
              </span>
            </motion.h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#111820] transition-colors"
            >
              {username && (
                <div className="w-8 h-8 rounded-full bg-[#facc16] flex items-center justify-center text-[#111828] font-semibold">
                  {username[0].toUpperCase()}
                </div>
              )}
              <span className="text-[#ffffff]">{username}</span>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#111820] rounded-lg shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-[#3d4753]">
                    <p className="text-sm text-[#ffffff] opacity-70">
                      Signed in as
                    </p>
                    <p className="text-[#ffffff] font-medium">{username}</p>
                  </div>
                  <LogoutButton className="w-full text-left px-4 py-2 text-[#ffffff] hover:bg-[#3d4753] transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
