"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from '../store/sidebarStore';
import ConfirmDialog from '@/components/ui/confirmDialog';
import { formatDate } from '@/components/utils/formatDate';

interface Project {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  project_id?: string;
  project_name?: string;
}

interface NoteCardProps {
  note: Note;
  onUpdate: () => void;
}

export default function NoteCard({ note, onUpdate }: NoteCardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
    const { isOpen } = useSidebarStore();
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    note.project_id
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/project/getProject');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  }, []);

  // First useEffect for initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const handleOpenNote = (event: CustomEvent) => {
      if (event.detail.noteId === note.id) {
        setIsExpanded(true);
      }
    };
  
    window.addEventListener('openNote', handleOpenNote as EventListener);
    return () => {
      window.removeEventListener('openNote', handleOpenNote as EventListener);
    };
  }, [note.id]);
    
    // Add event listener for project updates
    useEffect(() => {
      window.addEventListener('projectCreated', fetchProjects);
      window.addEventListener('projectUpdated', fetchProjects);
      
      return () => {
        window.removeEventListener('projectCreated', fetchProjects);
        window.removeEventListener('projectUpdated', fetchProjects);
      };
    }, [fetchProjects]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/note/updateNote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note.id, title, content }),
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`/api/note/deleteNote?id=${note.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onUpdate();
        setIsExpanded(false);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };


  const handleProjectChange = async (projectId: string | undefined) => {
    setSelectedProject(projectId);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/note/updateNote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: note.id,
          title,
          content,
          projectId,
        }),
      });
      if (res.ok) {
        // Dispatch event to refresh notes
        window.dispatchEvent(new CustomEvent("noteUpdated"));
        onUpdate(); // Refresh parent component
      }
    } catch (error) {
      console.error("Failed to update note project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const compactView = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsExpanded(true)}
      className="bg-[#3d4753]/90 backdrop-blur-sm rounded-lg p-4 shadow-lg cursor-pointer 
      hover:shadow-xl hover:shadow-[#111820]/20 hover:scale-[1.02] hover:bg-[#3d4753] 
      transition-all duration-200 max-w-[280px] w-full mx-auto border border-[#111820]/20"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#ffffff]/60 font-medium">
          {formatDate(note.updated_at)}
        </span>
      </div>
      {note.project_name && (
        <div className="text-sm bg-[#facc16]/90 text-[#111828] rounded-full font-semibold 
        px-2.5 py-0.5 inline-block mb-2 hover:bg-[#facc16] transition-colors">
          {note.project_name}
        </div>
      )}
      <h3 className="text-[#ffffff] font-bold mb-2 text-lg">
        {title || 'Untitled'}
      </h3>
      <p className="text-[#ffffff]/80 line-clamp-3 text-sm font-medium">
        {content || 'No content'}
      </p>
    </motion.div>
  );

  const ProjectSelector = () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <button
        onClick={() => handleProjectChange(undefined)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          !selectedProject
            ? "bg-[#facc16] text-[#111828]"
            : "bg-[#111820] text-[#ffffff] hover:bg-[#1c2434]"
        }`}
      >
        No Project
      </button>
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => handleProjectChange(project.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedProject === project.id
              ? "bg-[#facc16] text-[#111828]"
              : "bg-[#111820] text-[#ffffff] hover:bg-[#1c2434]"
          }`}
        >
          {project.name}
        </button>
      ))}
    </div>
  );

  const expandedView = (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className={`fixed z-40 ${isOpen ? 'left-[300px]' : 'left-0'} right-0 top-[64px] bottom-0 transition-all duration-300`}
  >
    <div 
      className="w-full h-full bg-[#3d4753] shadow-2xl overflow-auto custom-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="sticky top-0 z-10 bg-[#3d4753] border-b border-[#111820] px-6 py-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent text-[#ffffff] focus:outline-none focus:border-b-2 border-[#facc16] w-full max-w-2xl transition-all duration-200"
            placeholder="Untitled"
          />
          <div className="flex items-center mt-2">
  <span className="text-sm text-[#ffffff]/60">
    Last modified: {formatDate(note.updated_at, true)}
  </span>
</div>
            <div className="flex items-center space-x-4">
              {isSaving && (
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-[#ffffff] opacity-70 text-sm"
                >
                  Saving...
                </motion.span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(false)}
                className="group p-2 hover:bg-[#111820] rounded-full transition-all duration-200"
              >
                <svg 
                  className="w-6 h-6 text-[#ffffff] transform transition-transform duration-200 group-hover:rotate-90" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>
          <div className="mt-4">
            <ProjectSelector />
          </div>
        </div>
        <div className="px-6 py-4">

        <div 
  ref={contentRef}
  contentEditable={true}
  onBlur={(e) => setContent(e.currentTarget.textContent || "")}
  className="prose prose-invert max-w-none text-lg font-nunito focus:outline-none min-h-[calc(100vh-16rem)] 
    prose-p:text-[#ffffff]/80 prose-headings:text-[#ffffff] prose-strong:text-[#ffffff] 
    prose-em:text-[#ffffff]/80 prose-code:text-[#ffffff]/90 prose-pre:bg-[#111820]
    prose-blockquote:text-[#ffffff]/70 prose-blockquote:border-l-[#facc16]"
  dangerouslySetInnerHTML={{ __html: content }}
/>
      </div>
  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="sticky bottom-0 bg-[#3d4753] border-t border-[#111820] px-6 py-4"
        >
          <div className="flex justify-between items-center max-w-6xl mx-auto">
          <button
        onClick={() => setIsDeleteDialogOpen(true)}
        className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
      >
        Delete
      </button>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 bg-[#facc16] text-[#111828] rounded-md ${
                isSaving ? "opacity-50" : "hover:bg-[#facc16]/90"
              } transition-all duration-200 transform hover:scale-105 active:scale-95`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isExpanded ? expandedView : compactView}
    </AnimatePresence>
  );
}
