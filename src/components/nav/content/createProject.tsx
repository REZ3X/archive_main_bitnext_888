'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateProject() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/project/createProject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName('');
        setIsOpen(false);
        // Dispatch event with project data
        window.dispatchEvent(new CustomEvent('projectCreated', {
          detail: { message: 'Project created successfully' }
        }));
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-[#facc16] text-[#111828] rounded-md hover:bg-[#facc16]/90 transition-colors"
      >
        Create Project
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-4 bg-[#111820] rounded-md"
          >
            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                className="w-full p-2 bg-[#3d4753] text-[#ffffff] rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#facc16]"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-[#ffffff] hover:bg-[#3d4753] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className={`px-3 py-1 bg-[#facc16] text-[#111828] rounded-md ${
                    isLoading || !name.trim() ? 'opacity-50' : 'hover:bg-[#facc16]/90'
                  } transition-colors`}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}