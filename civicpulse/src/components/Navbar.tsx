import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, PlusCircle, Building2, UserCheck, Radio, X } from 'lucide-react';
import { useCivic } from '../context/CivicContext';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-accent focus-visible:ring-offset-2 focus-visible:ring-offset-civic-dark';

export const Navbar: React.FC = () => {
  const { role, setRole, searchQuery, setSearchQuery } = useCivic();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-civic-border bg-civic-dark/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4">
        <Link to="/" aria-label="CivicPulse home" className={`group flex shrink-0 items-center gap-2.5 rounded-lg ${focusRing}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-accent shadow-card">
            <Radio className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight text-civic-text">
              Civic<span className="text-civic-accent">Pulse</span>
            </span>
            <span className="hidden text-[11px] text-civic-muted sm:block">Anti-corruption &amp; civic network</span>
          </span>
        </Link>

        <div className="mx-auto hidden w-full max-w-xl md:block" role="search">
          <label htmlFor="global-search" className="sr-only">Search reports</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-civic-muted" aria-hidden="true" />
            <input
              id="global-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, departments, states"
              className="w-full rounded-full border border-civic-border bg-civic-surface py-2 pl-10 pr-10 text-sm text-civic-text placeholder:text-civic-muted/70 focus:border-civic-accent focus:outline-none focus:ring-1 focus:ring-civic-accent"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className={`absolute right-3 top-1/2 -translate-y-1/2 rounded text-civic-muted hover:text-civic-text ${focusRing}`}>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <nav aria-label="Primary" className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <span className="hidden items-center gap-1.5 rounded-full border border-civic-green/30 bg-civic-green/10 px-3 py-1.5 text-xs font-medium text-civic-green xl:flex">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Identity shield on
          </span>

          <div className="flex items-center rounded-xl border border-civic-border bg-civic-surface p-1" role="group" aria-label="View as">
            <button type="button" aria-pressed={role === 'citizen'} onClick={() => setRole('citizen')} title="Citizen view"
              className={`flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${focusRing} ${role === 'citizen' ? 'bg-civic-accent text-white' : 'text-civic-muted hover:bg-civic-hover hover:text-civic-text'}`}>
              <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Citizen</span>
            </button>
            <button type="button" aria-pressed={role === 'official'} onClick={() => { setRole('official'); navigate('/gov-dashboard'); }} title="Government official view"
              className={`flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${focusRing} ${role === 'official' ? 'bg-civic-blue text-white' : 'text-civic-muted hover:bg-civic-hover hover:text-civic-text'}`}>
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Official</span>
            </button>
          </div>

          <Link to="/submit" className={`flex min-h-[40px] items-center gap-2 rounded-xl bg-civic-accent px-4 text-sm font-semibold text-white shadow-card transition-colors hover:bg-orange-600 ${focusRing}`}>
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Report issue</span>
            <span className="sm:hidden">Report</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Feed', end: true },
    { to: '/gov-portals', label: 'Portals', end: false },
    { to: '/submit', label: 'Report', end: false },
    { to: '/gov-dashboard', label: 'Dashboard', end: false },
  ];
  return (
    <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-civic-border bg-civic-dark/95 backdrop-blur lg:hidden">
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end={i.end}
          className={({ isActive }) => `flex min-h-[52px] items-center justify-center text-xs font-medium ${focusRing} ${isActive ? 'text-civic-accent' : 'text-civic-muted'}`}>
          {i.label}
        </NavLink>
      ))}
    </nav>
  );
};
