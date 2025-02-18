'use client';
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfirmDialog from '@/components/ui/confirmDialog';

interface Project {
  id: string;
  name: string;
  created_at: string;
}

interface ProjectListProps {
  onProjectSelect: (projectId: string) => void;
  selectedProjectId: string | null;
}

export default function ProjectList({ onProjectSelect, selectedProjectId }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProjects();
    window.addEventListener('projectCreated', fetchProjects);
    return () => window.removeEventListener('projectCreated', fetchProjects);
  }, []);

  const handleUpdateProject = async (id: string) => {
    try {
      const res = await fetch('/api/project/updateProject', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName }),
      });
      if (res.ok) {
        setEditingProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const res = await fetch(`/api/project/deleteProject?id=${projectToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProjects();
        if (selectedProjectId === projectToDelete) {
          onProjectSelect('');
        }
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className={`p-3 rounded-md cursor-pointer ${
              selectedProjectId === project.id ? 'bg-[#111820]' : 'hover:bg-[#111820]/50'
            }`}
            onClick={() => onProjectSelect(project.id)}
          >
            <div className="flex items-center justify-between">
              {editingProject === project.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-[#111820] text-[#ffffff] px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#facc16]"
                  onBlur={() => handleUpdateProject(project.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateProject(project.id)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <div className="flex-1 text-[#ffffff]">
                  {project.name}
                </div>
              )}
              <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleDeleteClick(project.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </>
  );
}