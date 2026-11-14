import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#FF4500]/30 selection:text-[#FF4500]">
      {/* Top Navbar */}
      <Navbar />

      {/* 3-Column Responsive Body Shell */}
      <div className="max-w-[1440px] w-full mx-auto px-4 py-6 flex-1 flex justify-center gap-6">
        
        {/* Left Sidebar (Desktop only) */}
        <div className="hidden lg:block shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          <LeftSidebar />
        </div>

        {/* Center Main Stage (Dynamic Feed / Route Outlet) */}
        <main className="flex-1 max-w-2xl min-w-0">
          <Outlet />
        </main>

        {/* Right Sidebar (Desktop only) */}
        <div className="hidden xl:block shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pl-1">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
};
