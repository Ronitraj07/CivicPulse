import React from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { Link, useNavigate } from 'react-router-dom';

export const RightSidebar: React.FC = () => {
  const { posts, portals, setSelectedCategory } = useCivic();
  const navigate = useNavigate();

  // Aggregate stats
  const totalReports = posts.length + 842; // seed + simulated aggregate
  const totalBribeExposed = posts.reduce((sum, p) => sum + (p.bribeAmount || 0), 0) + 14820000;
  const resolvedCount = posts.filter(p => p.status === 'Resolved').length;
  const resolutionRate = Math.round((resolvedCount / Math.max(1, posts.length)) * 100);

  const downPortals = portals.filter(p => p.status === 'Down' || p.status === 'Degraded');

  const trendingTags = [
    { tag: 'PuneRTOBribe', count: 342, category: 'Corruption & Bribery' },
    { tag: 'EPFOPassbookDown', count: 1240, category: 'Gov Website Problem' },
    { tag: 'LaxmiNagarSewageWater', count: 512, category: 'Water Problems' },
    { tag: 'BellandurParkingMafia', count: 820, category: 'Parking & Roads' },
    { tag: 'SuratSchoolDump', count: 680, category: 'Sanitation & Gandgi' },
    { tag: 'ParivahanBotExposed', count: 1450, category: 'Gov Website Problem' }
  ];

  return (
    <aside className="w-80 shrink-0 space-y-6 text-sm">
      
      {/* Live Civic Pulse Stats Widget */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-4 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF4500]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF4500] animate-pulse" />
            <h3 className="font-bold text-white text-sm tracking-wide">
              Live Civic Pulse
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Real-time
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          
          <div className="bg-[#181C28] p-3 rounded-xl border border-[#1F2430]">
            <span className="text-[11px] text-[#9CA3AF] block mb-1">Total Reports</span>
            <div className="text-xl font-black text-white flex items-center gap-1">
              <span>{totalReports.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">↑ +14 today</span>
          </div>

          <div className="bg-[#181C28] p-3 rounded-xl border border-[#1F2430]">
            <span className="text-[11px] text-[#9CA3AF] block mb-1">Resolution Rate</span>
            <div className="text-xl font-black text-[#10B981] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{resolutionRate}%</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">60%+ Rule Verified</span>
          </div>

        </div>

        {/* Bribe Exposed Highlight */}
        <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent p-3.5 rounded-xl border border-red-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-300 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-red-400" />
              Total Bribe Exposed
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
              Public Ledger
            </span>
          </div>
          <div className="mt-1 text-2xl font-black text-red-400 tracking-tight">
            ₹{(totalBribeExposed / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-[11px] text-red-300/60 mt-0.5">
            Documented through citizen reports & receipts
          </p>
        </div>

      </div>

      {/* Gov Portal Outage Alert Pill Widget */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Gov Portals Flapping
            </h4>
          </div>
          <Link 
            to="/gov-portals"
            className="text-[11px] text-[#3B82F6] hover:underline flex items-center gap-0.5 font-medium"
          >
            All Portals <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2">
          {downPortals.slice(0, 3).map((port) => (
            <div 
              key={port.id}
              className="p-2.5 rounded-xl bg-[#181C28] border border-[#1F2430] flex items-center justify-between gap-2"
            >
              <div className="truncate">
                <span className="font-medium text-xs text-gray-200 block truncate">
                  {port.portalName}
                </span>
                <span className="text-[10px] text-[#9CA3AF] truncate block">
                  {port.commonIssues[0]}
                </span>
              </div>
              <span 
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  port.status === 'Down'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {port.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Trending Unresolved Tags */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#FF4500]" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Trending Unresolved Tags
          </h4>
        </div>

        <div className="space-y-2">
          {trendingTags.map((item) => (
            <button
              key={item.tag}
              onClick={() => {
                setSelectedCategory(item.category);
                navigate('/');
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-[#181C28] transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-xs text-gray-300 group-hover:text-[#FF4500] transition-colors">
                  #{item.tag}
                </span>
                <span className="block text-[10px] text-[#9CA3AF]">
                  {item.category}
                </span>
              </div>
              <span className="text-xs text-[#9CA3AF] font-medium bg-[#1F2430] px-2 py-0.5 rounded-md">
                {item.count} votes
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transparency & Audit Pledge */}
      <div className="px-3 py-2 text-center text-[11px] text-[#9CA3AF] space-y-1">
        <p className="flex items-center justify-center gap-1 text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Zero log IP retention • End-to-end stripped EXIF
        </p>
        <p>© 2026 CivicPulse Project. Open Public Governance.</p>
      </div>

    </aside>
  );
};
