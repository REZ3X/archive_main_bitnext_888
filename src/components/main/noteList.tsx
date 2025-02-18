'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}
import NoteCard from './noteCard';
import { useSidebarStore } from '../store/sidebarStore';
import SearchBar from './searchBar';
import FilterButton from './filterButton';

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen } = useSidebarStore();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/note/readNote');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error: unknown) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/project/getProject');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterNotes(query, selectedProject);
  };

  const handleFilter = (projectId: string | null) => {
    setSelectedProject(projectId);
    filterNotes(searchQuery, projectId);
  };

  const filterNotes = (query: string, projectId: string | null) => {
    let filtered = [...notes];
    
    if (query) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (projectId) {
      filtered = filtered.filter(note => note.project_id === projectId);
    }
    
    setFilteredNotes(filtered);
  };

  return (
    <div className="note-list-container">
      <div className="flex items-center justify-between gap-4 mb-6 px-4">
        <SearchBar onSearch={handleSearch} />
        <FilterButton
          options={projects.map(p => ({ id: p.id, label: p.name }))}
          onFilter={handleFilter}
        />
      </div>
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <motion.div
        layout
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`grid gap-3 ${
          isOpen
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[900px]'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1200px]'
        } mx-auto`}
      >
        {isLoading ? (
          <motion.div
            layout
            className="col-span-full flex justify-center items-center py-8"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-3 h-3 bg-[#facc16] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="w-3 h-3 bg-[#facc16] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
              <motion.div
                className="w-3 h-3 bg-[#facc16] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.4
                }}
              />
            </div>
          </motion.div>
        ) : filteredNotes.length > 0 || (notes.length > 0 && !searchQuery && !selectedProject) ? (
          (filteredNotes.length > 0 ? filteredNotes : notes).map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NoteCard note={note} onUpdate={fetchNotes} />
            </motion.div>
          ))
        ) : (
          <motion.div
            layout
            className="text-[#ffffff] col-span-full text-center py-8"
          >
            No notes found. Create your first note!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}