import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, MobileNav } from './Navbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-civic-dark font-sans text-civic-text selection:bg-civic-accent/30">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-civic-accent focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Navbar />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 justify-center gap-6 px-4 pb-24 pt-6 lg:pb-8">
        <aside aria-label="Sections" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] shrink-0 self-start overflow-y-auto pr-1 lg:block">
          <LeftSidebar />
        </aside>

        <main id="main" className="min-w-0 max-w-2xl flex-1">
          <Outlet />
        </main>

        <aside aria-label="Highlights" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] shrink-0 self-start overflow-y-auto pl-1 xl:block">
          <RightSidebar />
        </aside>
      </div>

      <footer className="border-t border-civic-border py-6 text-center text-xs text-civic-muted">
        CivicPulse is a demo project. Reports shown are sample data.
      </footer>
      <MobileNav />
    </div>
  );
};
