"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  name: string;
}

export default function CreateNote() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    if (!content.trim() && !title.trim()) {
      setIsExpanded(false);
      setTitle("");
      setContent("");
      setError("");
    }
  }, [content, title]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);


  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/project/getProject");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    
    window.addEventListener('projectCreated', fetchProjects);
    window.addEventListener('projectUpdated', fetchProjects);
    
    return () => {
      window.removeEventListener('projectCreated', fetchProjects);
      window.removeEventListener('projectUpdated', fetchProjects);
    };
  }, [fetchProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/note/createNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          projectId: selectedProject,
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setSelectedProject(null);
        setIsExpanded(false);
        window.dispatchEvent(new CustomEvent("noteCreated"));
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create note");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      setError("Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    collapsed: { 
      height: "56px",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    expanded: { 
      height: "auto",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <motion.div
        layout
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        className="bg-[#3d4753] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 bg-[#3d4753] text-[#ffffff] border-b border-[#facc16] focus:outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
  
          <div className="relative">
            <motion.textarea
              layout
              placeholder={isExpanded ? "Take a note..." : "Click to add a note..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={() => !isExpanded && setIsExpanded(true)}
              animate={{ height: isExpanded ? "160px" : "56px" }}
              transition={{ duration: 0.2 }}
              className="w-full p-4 bg-[#3d4753] text-[#ffffff] focus:outline-none resize-none transition-all duration-300"
            />
  
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div className="p-4 flex justify-between items-center bg-[#3d4753] border-t border-[#111820]">
                    <select
                      value={selectedProject || ""}
                      onChange={(e) => setSelectedProject(e.target.value || null)}
                      className="bg-[#111820] text-[#ffffff] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#facc16] transition-all duration-200"
                    >
                      <option value="">No Project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleClose()}
                        className="px-4 py-2 text-[#ffffff] hover:bg-[#111820] rounded-md transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className={`px-4 py-2 bg-[#facc16] text-[#111828] rounded-md font-medium
                          ${isLoading || !content.trim()
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#facc16]/90 hover:shadow-md"
                          } transition-all duration-200`}
                      >
                        {isLoading ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
