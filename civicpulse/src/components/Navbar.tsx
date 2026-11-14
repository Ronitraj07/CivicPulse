import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  PlusCircle, 
  Building2, 
  UserCheck, 
  Radio, 
  X
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const Navbar: React.FC = () => {
  const { role, setRole, searchQuery, setSearchQuery } = useCivic();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#1F2430]">
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4500] to-orange-500 flex items-center justify-center shadow-lg shadow-[#FF4500]/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#FF4500] transition-colors">
                Civic<span className="text-[#FF4500]">Pulse</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#1F2430] text-[#9CA3AF] border border-[#2D3748]">
                Beta
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] -mt-1 hidden sm:block">
              Anti-Corruption & Civic Network
            </p>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, RTO, water leak, corruption in s/Maharashtra..."
              className="w-full pl-10 pr-10 py-2 rounded-full bg-[#12141D] border border-[#1F2430] text-sm text-gray-200 placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Identity Shield Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Identity Shield: <strong className="font-semibold text-emerald-300">ON</strong></span>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-[#12141D] p-1 rounded-xl border border-[#1F2430]">
            <button
              onClick={() => setRole('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'citizen'
                  ? 'bg-[#FF4500] text-white shadow-md shadow-[#FF4500]/25'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#181C28]'
              }`}
              title="Citizen / Whistleblower Feed"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Citizen View</span>
            </button>
            <button
              onClick={() => {
                setRole('official');
                navigate('/gov-dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === 'official'
                  ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/25'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#181C28]'
              }`}
              title="Government Authority Resolution Panel"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gov Official View</span>
            </button>
          </div>

          {/* "+ Report Issue" CTA */}
          <Link
            to="/submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF4500] hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#FF4500]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Issue</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
