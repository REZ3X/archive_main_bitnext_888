'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectList from './content/projectList';
import CreateProject from './content/createProject';
import ProjectDetail from '../main/projectDetail';
import SidebarNoteList from './content/noteList';
import { useSidebarStore } from '../store/sidebarStore';

export default function SideBarNav() {
  const { isOpen, setIsOpen } = useSidebarStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseDetail = () => {
    setSelectedProjectId(null);
  };

  return (
    <>
      <motion.div
  initial={{ width: 300 }}
  animate={{ width: isOpen ? 300 : 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  className="h-screen fixed left-0 top-0 bg-[#3d4753] z-40 overflow-hidden border-r border-[#111820] sidebar-nav"
>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#ffffff] text-lg font-semibold">Projects</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-[#111820] rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <CreateProject />
          <ProjectList onProjectSelect={handleProjectSelect} selectedProjectId={selectedProjectId} />
          <SidebarNoteList />
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProjectId && (
          <ProjectDetail 
            projectId={selectedProjectId} 
            onClose={handleCloseDetail} 
          />
        )}
      </AnimatePresence>
    </>
  );
}