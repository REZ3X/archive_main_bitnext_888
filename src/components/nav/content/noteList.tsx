'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatDate } from '@/components/utils/formatDate';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  project_id?: string;
  project_name?: string;
}

export default function SidebarNoteList() {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/note/readNote');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleNoteClick = (note: Note) => {
    window.dispatchEvent(
      new CustomEvent('openNote', { 
        detail: { noteId: note.id }
      })
    );
  };

  useEffect(() => {
    fetchNotes();
    window.addEventListener('noteCreated', fetchNotes);
    window.addEventListener('noteUpdated', fetchNotes);
    
    return () => {
      window.removeEventListener('noteCreated', fetchNotes);
      window.removeEventListener('noteUpdated', fetchNotes);
    };
  }, []);

  return (
    <div className="mt-4">
      <div className="text-[#ffffff] opacity-70 text-sm mb-2 px-3">NOTES</div>
      <div className="space-y-1">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            layout
            className="px-3 py-2 rounded-md cursor-pointer hover:bg-[#111820]/50 transition-colors"
            onClick={() => handleNoteClick(note)}
          >
            <div className="flex items-center justify-between">
  <div className="text-[#ffffff] font-medium truncate flex-1">
    {note.title || 'Untitled'}
  </div>
  <div className="text-[#ffffff]/60 text-xs ml-2">
    {formatDate(note.updated_at)}
  </div>
</div>
            {note.project_name && (
              <div className="text-[#facc16] text-sm truncate mt-0.5">
                {note.project_name}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}