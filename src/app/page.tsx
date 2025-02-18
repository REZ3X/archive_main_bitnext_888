'use client';
import { useSidebarStore } from '../components/store/sidebarStore';
import CreateNote from '@/components/main/createNote';
import NoteList from '@/components/main/noteList';
import SideBarNav from '@/components/nav/sideBarNav';
import Header from '@/components/main/header';

export default function Home() {
  const { isOpen } = useSidebarStore();
  
  return (
    <div className={`min-h-screen bg-[#111828] ${!isOpen ? 'sidebar-closed' : ''} overflow-x-hidden`}>
      <SideBarNav />
      <div className="content-container">
        <div className="transition-all duration-300 main-content">
          <Header />
          <main className=" w-full">
            <CreateNote />
            <NoteList />
          </main>
        </div>
      </div>
    </div>
  );
}