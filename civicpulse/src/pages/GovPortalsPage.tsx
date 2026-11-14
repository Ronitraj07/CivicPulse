import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  Globe, 
  ExternalLink, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Plus, 
  Search, 
  X, 
  ShieldCheck, 
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GovPortalsPage: React.FC = () => {
  const { portals, votePortalIssue, addPortalBug, addPost } = useCivic();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Central' | 'State' | 'IssuesOnly'>('All');

  // "Report New Website Bug" Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPortalName, setSelectedPortalName] = useState(portals[0]?.portalName || '');
  const [customPortalName, setCustomPortalName] = useState('');
  const [portalJurisdiction, setPortalJurisdiction] = useState<'Central' | 'State'>('Central');
  const [bugCategory, setBugCategory] = useState('Payment Deducted & Failed');
  const [bugDescription, setBugDescription] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [votedPortalIds, setVotedPortalIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status metrics
  const totalPortals = portals.length;
  const downCount = portals.filter(p => p.status === 'Down').length;
  const degradedCount = portals.filter(p => p.status === 'Degraded').length;
  const operationalCount = portals.filter(p => p.status === 'Operational').length;
  const totalBugsReported = portals.reduce((sum, p) => sum + p.bugReportsCount, 0);

  // Filtered Portals List
  const filteredPortals = portals.filter((p) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.portalName.toLowerCase().includes(q);
      const matchUrl = p.url.toLowerCase().includes(q);
      const matchIssues = p.commonIssues.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchUrl && !matchIssues) return false;
    }

    // 2. Type filter
    if (filterType === 'Central') return p.category === 'Central';
    if (filterType === 'State') return p.category === 'State';
    if (filterType === 'IssuesOnly') return p.status === 'Down' || p.status === 'Degraded';

    return true;
  });

  const handleVote = (portalId: string) => {
    votePortalIssue(portalId);
    setVotedPortalIds(prev => new Set(prev).add(portalId));
    setToastMessage('+1 Issue recorded in community outage log!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const portalTitle = selectedPortalName === 'OTHER' ? customPortalName : selectedPortalName;
    if (!portalTitle.trim() || !bugDescription.trim()) {
      alert('Please provide portal name and description of the bug.');
      return;
    }

    const fullIssueTag = errorCode ? `${bugCategory} (${errorCode})` : bugCategory;

    // 1. Update GovTech Portals Board
    addPortalBug(portalTitle, portalJurisdiction, fullIssueTag);

    // 2. Create linked post in main social feed
    addPost({
      anonymousHash: `Anon#${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      state: portalJurisdiction === 'Central' ? 'Central Portal' : 'State Portal',
      city: 'National / Online',
      category: 'Gov Website Problem',
      subCategory: bugCategory,
      title: `${portalTitle}: ${bugCategory} - Citizens Unable To Proceed`,
      description: `${bugDescription}${errorCode ? `\n\nHTTP Error / Code: ${errorCode}` : ''}\n\nReported via GovTech Problem & Outage Tracker.`,
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      exifStripped: true,
      status: 'Reported',
      pollData: {
        question: `Are you also experiencing ${bugCategory} on ${portalTitle}?`,
        totalVotes: 1,
        options: [
          { id: 'opt-1', label: 'Yes, happening right now', votes: 1 },
          { id: 'opt-2', label: 'Extremely slow / gateway lag', votes: 0 },
          { id: 'opt-3', label: 'Working normally for me', votes: 0 }
        ]
      }
    });

    setIsModalOpen(false);
    setCustomPortalName('');
    setBugDescription('');
    setErrorCode('');
    setToastMessage(`Bug logged! Linked incident posted to Main Feed.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#12141D] border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header & Live Health Board */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">GovTech Problem & Outage Tracker</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  c/GovTechIssues
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1 max-w-xl leading-relaxed">
                Live crowdsourced status board monitoring downtime, OTP bottlenecks, payment crashes, and agent-nexus slot hoarding across Indian public portals.
              </p>
            </div>
          </div>

          {/* "+ Report Portal Bug" CTA */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Report Website Bug</span>
          </button>
        </div>

        {/* Health KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#1F2430]">
          <div className="bg-[#181C28] p-3 rounded-xl border border-[#1F2430]">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-0.5">Operational</span>
            <div className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{operationalCount} Portals</span>
            </div>
            <span className="text-[10px] text-[#9CA3AF]">Normal Latency</span>
          </div>

          <div className="bg-[#181C28] p-3 rounded-xl border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400/90 block mb-0.5">Slow / Degraded</span>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{degradedCount} Portals</span>
            </div>
            <span className="text-[10px] text-amber-300/60">High Failure Rate</span>
          </div>

          <div className="bg-[#181C28] p-3 rounded-xl border border-red-500/30">
            <span className="text-[10px] uppercase font-bold text-red-400 block mb-0.5">Server Outage / Down</span>
            <div className="text-lg font-black text-red-400 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>{downCount} Portals</span>
            </div>
            <span className="text-[10px] text-red-300/60">Severe Downtime</span>
          </div>

          <div className="bg-[#181C28] p-3 rounded-xl border border-[#1F2430]">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-0.5">Total Reports Logged</span>
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#FF4500]" />
              <span>{totalBugsReported.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] text-emerald-400">Crowdsourced</span>
          </div>
        </div>

      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        
        {/* Jurisdiction Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'All'
                ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
            }`}
          >
            All Portals ({totalPortals})
          </button>

          <button
            onClick={() => setFilterType('Central')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'Central'
                ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
            }`}
          >
            Central (Gov of India)
          </button>

          <button
            onClick={() => setFilterType('State')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'State'
                ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-400 hover:text-white hover:bg-[#181C28]'
            }`}
          >
            State Portals
          </button>

          <button
            onClick={() => setFilterType('IssuesOnly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'IssuesOnly'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                : 'text-red-400 hover:text-white hover:bg-red-950/40'
            }`}
          >
            Flapping / Broken Only ({downCount + degradedCount})
          </button>
        </div>

        {/* Portal Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search portal, OTP, Parivahan..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#181C28] border border-[#1F2430] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* 3. Portals Cards Grid */}
      <div className="grid gap-4">
        {filteredPortals.length === 0 ? (
          <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-12 text-center space-y-3">
            <Globe className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No government portals match your query</h3>
            <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
              Try searching for a different keyword or report this new portal to start tracking it.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('All');
              }}
              className="px-4 py-2 bg-[#181C28] text-gray-200 text-xs font-semibold rounded-xl border border-[#1F2430]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPortals.map((portal) => {
            const hasVoted = votedPortalIds.has(portal.id);
            const isDown = portal.status === 'Down';
            const isDegraded = portal.status === 'Degraded';

            return (
              <div
                key={portal.id}
                className="bg-[#12141D] rounded-2xl border border-[#1F2430] hover:border-[#2D3748] transition-all p-5 space-y-3.5 shadow-lg group"
              >
                {/* Top Row: Title, Category, URL, and Live Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                        {portal.portalName}
                      </h2>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#181C28] text-gray-300 border border-[#1F2430]">
                        {portal.category} Portal
                      </span>
                    </div>

                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 mt-1 font-mono"
                    >
                      <span>{portal.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDown ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/70 text-red-400 border border-red-500/40 animate-pulse">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Server Down / Outage
                      </span>
                    ) : isDegraded ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/70 text-amber-400 border border-amber-500/40">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Slow / Degraded Gateway
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Operational
                      </span>
                    )}
                  </div>
                </div>

                {/* Common Reported Bug Tags */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1.5">
                    Top Reported Citizen Glitches:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {portal.commonIssues.map((issue) => (
                      <span
                        key={issue}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#181C28] text-gray-300 border border-[#1F2430] flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls: "+1 I'm Facing an Issue" and Linked Feeds */}
                <div className="pt-3 border-t border-[#1F2430] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9CA3AF]">
                  <div className="flex items-center gap-3">
                    <span>Telemetry Checked: <strong className="text-gray-300">{portal.lastChecked}</strong></span>
                    <span>•</span>
                    <span className="text-gray-300 font-medium">
                      <strong className="text-[#FF4500]">{portal.bugReportsCount}</strong> citizen confirmations
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/"
                      className="px-3 py-1.5 rounded-xl bg-[#181C28] hover:bg-[#1F2430] text-gray-300 text-xs font-semibold border border-[#1F2430] transition-colors"
                    >
                      View Linked Feed
                    </Link>

                    {/* "+1 I'm Facing an Issue" Quick Vote Button */}
                    <button
                      onClick={() => handleVote(portal.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        hasVoted
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-sm'
                          : 'bg-[#181C28] hover:bg-[#1F2430] text-white border-[#1F2430] hover:border-gray-500'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'text-emerald-400' : 'text-[#FF4500]'}`} />
                      <span>{hasVoted ? 'Recorded (+1)' : "I'm Facing an Issue (+1)"}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. "Report New Website Bug" Modal Studio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12141D] rounded-3xl border border-[#1F2430] max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2430]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Report Government Portal Outage / Bug</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#181C28]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBugSubmit} className="space-y-3.5 text-xs">
              
              {/* Jurisdiction */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Portal Type / Tier</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPortalJurisdiction('Central')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      portalJurisdiction === 'Central'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-[#181C28] text-gray-400 border-[#1F2430]'
                    }`}
                  >
                    Central Govt Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortalJurisdiction('State')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      portalJurisdiction === 'State'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-[#181C28] text-gray-400 border-[#1F2430]'
                    }`}
                  >
                    State / Municipal Portal
                  </button>
                </div>
              </div>

              {/* Target Portal Selection */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Select Target Portal *</label>
                <select
                  value={selectedPortalName}
                  onChange={(e) => setSelectedPortalName(e.target.value)}
                  className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {portals.map((p) => (
                    <option key={p.id} value={p.portalName}>
                      {p.portalName} ({p.category})
                    </option>
                  ))}
                  <option value="OTHER">+ Other Government Website (Specify)</option>
                </select>
              </div>

              {/* If "OTHER", custom portal input */}
              {selectedPortalName === 'OTHER' && (
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Custom Portal Name & URL *</label>
                  <input
                    type="text"
                    value={customPortalName}
                    onChange={(e) => setCustomPortalName(e.target.value)}
                    placeholder="e.g. Mahavitaran Electricity Billing (mahadiscom.in)"
                    required
                    className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Bug Category */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Observed Failure Category *</label>
                <select
                  value={bugCategory}
                  onChange={(e) => setBugCategory(e.target.value)}
                  className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Server Down / Crash">Server Down / Crash (HTTP 500, 502, 504)</option>
                  <option value="Payment Deducted & Failed">Payment Deducted & Receipt Failed</option>
                  <option value="OTP Not Coming">OTP SMS Never Arriving / Gateway Timeout</option>
                  <option value="Agent Nexus / Slot Blocking">Agent Nexus / Slot Vanishing in Seconds via Script Bots</option>
                  <option value="Captcha Reload Loop">Broken Captcha / Infinite Reload Loop</option>
                  <option value="Digital Certificate Corrupt">Digital Signature / PDF Download Corrupt</option>
                </select>
              </div>

              {/* Error code / Reference */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Error Code / URL Endpoint (Optional)</label>
                <input
                  type="text"
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  placeholder="e.g. ERR_CONNECTION_TIMED_OUT or HTTP 500 at /payment/gateway"
                  className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Bug Details */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Incident Explanation *</label>
                <textarea
                  rows={3}
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  required
                  placeholder="Describe your browser, time of attempt, bank reference if money deducted, or broker nexus observed..."
                  className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-xl text-[11px] text-blue-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Logging this will simultaneously update the GovTech outage telemetry and create an active whistleblower poll on the social feed.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#181C28] text-gray-300 font-semibold hover:bg-[#1F2430] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all"
                >
                  Publish Outage Bug
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
