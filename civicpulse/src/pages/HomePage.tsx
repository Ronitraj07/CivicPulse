import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { PostCard } from '../components/PostCard';
import { 
  Flame, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  X,
  Droplets,
  Trash2,
  Car,
  Globe,
  Layers,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { stateName } = useParams<{ stateName?: string }>();
  const { 
    posts, 
    selectedState, 
    setSelectedState, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearchQuery,
    feedFilter, 
    setFeedFilter 
  } = useCivic();

  // Sync state param if routed via /s/:stateName
  useEffect(() => {
    if (stateName) {
      setSelectedState(stateName);
    }
  }, [stateName, setSelectedState]);

  // Filter posts based on State, Category, Search Query, and Feed Filter
  const filteredPosts = posts.filter((post) => {
    // 1. State Filter
    if (selectedState !== 'All' && post.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.city.toLowerCase().includes(q) ||
        post.state.toLowerCase().includes(q) ||
        post.subCategory.toLowerCase().includes(q) ||
        post.anonymousHash.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 4. Tab Feed Filter
    if (feedFilter === 'shame') {
      return (post.slaDays >= 7 && post.status !== 'Resolved') || post.status === 'Resolution Disputed';
    }
    if (feedFilter === 'resolved') {
      return post.status === 'Resolved' || post.officialResponse !== undefined;
    }

    return true;
  });

  // Sort posts based on the active tab
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (feedFilter === 'hot') {
      // Hot score = upvotes + poll votes
      const scoreA = a.upvotes + a.pollData.totalVotes;
      const scoreB = b.upvotes + b.pollData.totalVotes;
      return scoreB - scoreA;
    }
    if (feedFilter === 'new') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (feedFilter === 'shame') {
      return b.slaDays - a.slaDays; // longest pending first
    }
    if (feedFilter === 'resolved') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const categoryPills = [
    { label: 'All Issues', value: 'All', icon: Layers },
    { label: 'Corruption & Bribery', value: 'Corruption & Bribery', icon: ShieldCheck },
    { label: 'Water Issues', value: 'Water Problems', icon: Droplets },
    { label: 'Sanitation / Gandgi', value: 'Sanitation & Gandgi', icon: Trash2 },
    { label: 'Parking & Roads', value: 'Parking & Roads', icon: Car },
    { label: 'Gov Portals', value: 'Gov Website Problem', icon: Globe }
  ];

  return (
    <div className="space-y-4">
      
      {/* 1. Feed Filter Bar */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-2 space-y-2 shadow-lg">
        
        {/* Primary Tabs (Hot, New, Shame Clock, Resolved) */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFeedFilter('hot')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                feedFilter === 'hot'
                  ? 'bg-[#FF4500] text-white shadow-md shadow-[#FF4500]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-200" />
              <span>Hot Issues</span>
            </button>

            <button
              onClick={() => setFeedFilter('new')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                feedFilter === 'new'
                  ? 'bg-[#FF4500] text-white shadow-md shadow-[#FF4500]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Newest</span>
            </button>

            <button
              onClick={() => setFeedFilter('shame')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                feedFilter === 'shame'
                  ? 'bg-[#EF4444] text-white shadow-md shadow-red-500/25 ring-1 ring-red-400'
                  : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
              }`}
              title="Complaints unaddressed for over 7 days"
            >
              <AlertOctagon className="w-4 h-4 text-red-300" />
              <span className="hidden sm:inline">Shame Clock (7d+ Unresolved)</span>
              <span className="sm:hidden">Shame Clock</span>
            </button>

            <button
              onClick={() => setFeedFilter('resolved')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                feedFilter === 'resolved'
                  ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gov Responded</span>
            </button>
          </div>

          <span className="text-[11px] text-[#9CA3AF] px-2 font-medium shrink-0 hidden md:block">
            {sortedPosts.length} incidents
          </span>
        </div>

        {/* Category Pill Filters Row */}
        <div className="pt-2 border-t border-[#1F2430]/60 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryPills.map((pill) => {
            const isSelected = selectedCategory === pill.value;
            const Icon = pill.icon;

            return (
              <button
                key={pill.value}
                onClick={() => setSelectedCategory(pill.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#181C28] text-[#FF4500] border border-[#FF4500]/50 font-bold shadow-sm'
                    : 'bg-[#12141D] text-gray-400 hover:text-gray-200 hover:bg-[#181C28] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF4500]' : 'text-gray-500'}`} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. Active Filter Banner (State / Category / Search) */}
      {(selectedState !== 'All' || selectedCategory !== 'All' || searchQuery) && (
        <div className="bg-[#181C28] border border-[#1F2430] px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#9CA3AF] font-medium">Filtering by:</span>

            {selectedState !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#FF4500]/20 text-[#FF4500] font-bold border border-[#FF4500]/30">
                <MapPin className="w-3 h-3" />
                s/{selectedState}
                <button
                  onClick={() => setSelectedState('All')}
                  className="hover:text-white"
                  title="Remove state filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-white"
                  title="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-white"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedState('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-[11px] text-[#9CA3AF] hover:text-[#FF4500] font-semibold transition-colors shrink-0"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 3. Shame Clock Informational Banner if active tab */}
      {feedFilter === 'shame' && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/30 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-red-300 block">SLA Shame Clock Activated</span>
              <span className="text-[11px] text-red-200/70">
                Listing public grievances that have remained unresolved for &gt; 7 days despite community reports.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Posts Feed List */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#181C28] text-gray-400 flex items-center justify-center mx-auto border border-[#1F2430]">
              <Sparkles className="w-7 h-7 text-[#FF4500]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">No reports match your filters</h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1">
                No active complaints reported in {selectedState !== 'All' ? `s/${selectedState}` : 'this feed'} for this criteria.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedState('All');
                  setSelectedCategory('All');
                  setFeedFilter('hot');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#181C28] hover:bg-[#1F2430] text-gray-200 text-xs font-semibold border border-[#1F2430] transition-colors"
              >
                Reset All Filters
              </button>
              <Link
                to="/submit"
                className="px-4 py-2 rounded-xl bg-[#FF4500] hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-[#FF4500]/25 transition-all"
              >
                + Report New Issue
              </Link>
            </div>
          </div>
        ) : (
          sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

    </div>
  );
};
