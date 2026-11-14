import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Globe, 
  Trophy, 
  MapPin, 
  ShieldAlert, 
  Droplets, 
  Trash2, 
  Car, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { STATES_LIST, CATEGORIES_LIST } from '../mockData';

export const LeftSidebar: React.FC = () => {
  const { 
    selectedState, 
    setSelectedState, 
    selectedCategory, 
    setSelectedCategory 
  } = useCivic();

  const navigate = useNavigate();

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    navigate(`/s/${stateName}`);
  };

  const handleResetState = () => {
    setSelectedState('All');
    navigate('/');
  };

  const handleCategoryClick = (categoryName: string) => {
    const formatted = categoryName === 'All Categories' ? 'All' : categoryName;
    setSelectedCategory(formatted);
    navigate('/');
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'Trash2': return <Trash2 className="w-4 h-4 text-emerald-400" />;
      case 'Car': return <Car className="w-4 h-4 text-amber-400" />;
      case 'Globe': return <Globe className="w-4 h-4 text-purple-400" />;
      default: return <Layers className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <aside className="w-64 shrink-0 space-y-6 text-sm">
      
      {/* Primary Navigation Links */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-3 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
              isActive && selectedState === 'All' && selectedCategory === 'All'
                ? 'bg-[#FF4500]/15 text-[#FF4500] font-semibold border border-[#FF4500]/30'
                : 'text-gray-300 hover:text-white hover:bg-[#181C28]'
            }`
          }
          onClick={() => {
            setSelectedState('All');
            setSelectedCategory('All');
          }}
        >
          <Flame className="w-4 h-4 text-[#FF4500]" />
          <span>Home Social Feed</span>
        </NavLink>

        <NavLink
          to="/gov-portals"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
              isActive
                ? 'bg-[#3B82F6]/15 text-[#3B82F6] font-semibold border border-[#3B82F6]/30'
                : 'text-gray-300 hover:text-white hover:bg-[#181C28]'
            }`
          }
        >
          <Globe className="w-4 h-4 text-[#3B82F6]" />
          <div className="flex items-center justify-between flex-1">
            <span>GovTech Portal Bug</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
        </NavLink>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-400 hover:text-gray-200 transition-all cursor-pointer group">
          <Trophy className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between flex-1">
            <span>Clean Governance Ranks</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* State Communities (s/...) */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-3">
        <div className="flex items-center justify-between px-3 py-1 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            State Communities
          </span>
          {selectedState !== 'All' && (
            <button
              onClick={handleResetState}
              className="text-[11px] text-[#FF4500] hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
          {STATES_LIST.map((st) => {
            const isSelected = selectedState === st.name;
            return (
              <button
                key={st.name}
                onClick={() => handleStateClick(st.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-all ${
                  isSelected
                    ? 'bg-[#FF4500] text-white font-semibold shadow-md shadow-[#FF4500]/20'
                    : 'text-gray-300 hover:text-white hover:bg-[#181C28]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#FF4500]'}`} />
                  <span className="truncate">s/{st.name}</span>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-[#1F2430] text-[#9CA3AF]'
                  }`}
                >
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pill Filters */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-3">
        <div className="flex items-center justify-between px-3 py-1 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Categories
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-[11px] text-[#FF4500] hover:underline"
            >
              All
            </button>
          )}
        </div>

        <div className="space-y-0.5">
          {CATEGORIES_LIST.map((cat) => {
            const catKey = cat.name === 'All Categories' ? 'All' : cat.name;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium transition-all ${
                  isSelected
                    ? 'bg-[#181C28] text-[#FF4500] border border-[#FF4500]/40 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-[#181C28]'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Whistleblower Protection Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 text-xs text-indigo-200/80 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>100% Whistleblower Shield</span>
        </div>
        <p className="text-[11px] leading-relaxed text-indigo-300/70">
          All images scrub EXIF, GPS and hardware fingerprints automatically before public rendering.
        </p>
      </div>

    </aside>
  );
};
