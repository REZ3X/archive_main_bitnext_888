'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from './noteCard';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  project_id?: string;
  project_name?: string;
}

interface Project {
  id: string;
  name: string;
  created_at: string;
}

interface ProjectDetailProps {
  projectId: string | null;
  onClose: () => void;
}

export default function ProjectDetail({ projectId, onClose }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/project/getProjectDetail?id=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setNotes(data.notes);
      } else {
        setError('Failed to load project details');
      }
    } catch (err) {
      console.error('Error loading project details:', err);
      setError('Failed to load project details');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  if (!projectId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-[#3d4753] shadow-xl z-40 overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#3d4753] p-4 border-b border-[#111820] z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#ffffff]">
              {project?.name || 'Loading...'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#111820] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-[#ffffff] opacity-70">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-[#ffffff] opacity-70">No notes in this project</div>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onUpdate={fetchProjectDetails}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}