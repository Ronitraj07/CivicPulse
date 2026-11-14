import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  Building2, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileCheck, 
  X, 
  ExternalLink, 
  MapPin, 
  Award,
  Send,
  Activity,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, PostStatus } from '../types';

export const GovDashboardPage: React.FC = () => {
  const { posts, addOfficialAction, setRole } = useCivic();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');

  // Modal State
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [actionStatus, setActionStatus] = useState<PostStatus>('Under Review');
  const [authorityName, setAuthorityName] = useState('State Vigilance & Public Grievance Commission');
  const [department, setDepartment] = useState('Anti-Corruption & Municipal Oversight Wing');
  const [officerRole, setOfficerRole] = useState('Designated Chief Vigilance Officer');
  const [statement, setStatement] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [certified, setCertified] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // KPI Calculations
  const totalPending = posts.filter(p => p.status !== 'Resolved').length;
  const criticalCorruption = posts.filter(p => p.category === 'Corruption & Bribery' && p.status !== 'Resolved').length;
  const slaBreachedCount = posts.filter(p => p.slaDays >= 7 && p.status !== 'Resolved').length;
  const resolvedCount = posts.filter(p => p.status === 'Resolved').length;
  const resolutionPercentage = Math.round((resolvedCount / Math.max(1, posts.length)) * 100);

  // Filter queue
  const filteredQueue = posts.filter((p) => {
    // 1. Department
    if (selectedDept !== 'All' && p.category !== selectedDept) return false;
    // 2. State
    if (selectedState !== 'All' && p.state !== selectedState) return false;
    // 3. Urgency / Status
    if (selectedUrgency === 'Escalated' && p.status !== 'Escalated') return false;
    if (selectedUrgency === 'Under Review' && p.status !== 'Under Review') return false;
    if (selectedUrgency === 'Reported' && p.status !== 'Reported') return false;
    if (selectedUrgency === 'Resolved' && p.status !== 'Resolved') return false;

    // 4. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.anonymousHash.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Sort: Critical & high poll votes first
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    if (a.status === 'Escalated' && b.status !== 'Escalated') return -1;
    if (b.status === 'Escalated' && a.status !== 'Escalated') return 1;
    return (b.upvotes + b.pollData.totalVotes) - (a.upvotes + a.pollData.totalVotes);
  });

  const handleOpenActionModal = (post: Post) => {
    setActivePost(post);
    setActionStatus(post.status === 'Resolved' ? 'Resolved' : 'Under Review');
    setOrderNumber(`GOV-${post.state.slice(0, 2).toUpperCase()}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
    setStatement(
      post.officialResponse?.statement || 
      `Cognizance taken of public grievance in ${post.city}. Joint inspection ordered with local executive engineer.`
    );
    setProofUrl(post.officialResponse?.proofUrl || '');
    setCertified(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost) return;
    if (!statement.trim()) {
      alert('Please provide an official statement or order justification.');
      return;
    }

    addOfficialAction(activePost.id, {
      status: actionStatus,
      authorityName,
      department,
      officerRole,
      statement: statement.trim(),
      actionOrderNumber: orderNumber.trim(),
      proofUrl: proofUrl.trim() || (actionStatus === 'Resolved' ? 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80' : undefined)
    });

    setToastMessage(`Action Order #${orderNumber} successfully issued and synced to Public Audit Trail!`);
    setTimeout(() => setToastMessage(null), 4000);
    setActivePost(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#12141D] border border-blue-500/60 text-blue-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <FileCheck className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Official Authority Banner & Role Pill */}
      <div className="bg-gradient-to-r from-blue-950/70 via-[#12141D] to-[#12141D] rounded-3xl border border-blue-500/40 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Government Authority Control Room
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
                  Vigilance Console
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1 max-w-xl leading-relaxed">
                Centralized executive portal for Municipal Commissioners, Police Lokayukta, Department Engineers, and NIC Web Teams to issue official action orders and submit proof-based resolutions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setRole('citizen')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181C28] hover:bg-[#1F2430] text-gray-300 text-xs font-semibold border border-[#1F2430] transition-colors"
            >
              <UserCheck className="w-4 h-4 text-[#FF4500]" />
              <span>Switch to Citizen View</span>
            </button>
          </div>
        </div>

        {/* 2. KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#1F2430]">
          
          <div className="bg-[#181C28] p-3.5 rounded-2xl border border-[#1F2430]">
            <span className="text-[11px] uppercase font-bold text-[#9CA3AF] block mb-1">
              Active Triage Queue
            </span>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>{totalPending}</span>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold mt-0.5 block">
              Awaiting Official Action
            </span>
          </div>

          <div className="bg-[#181C28] p-3.5 rounded-2xl border border-red-500/40">
            <span className="text-[11px] uppercase font-bold text-red-300 block mb-1">
              Corruption Alerts
            </span>
            <div className="text-2xl font-black text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>{criticalCorruption}</span>
            </div>
            <span className="text-[10px] text-red-300/80 font-semibold mt-0.5 block">
              Bribery Extortion Flagged
            </span>
          </div>

          <div className="bg-[#181C28] p-3.5 rounded-2xl border border-red-500/40">
            <span className="text-[11px] uppercase font-bold text-red-300 block mb-1">
              SLA Breaches (7d+)
            </span>
            <div className="text-2xl font-black text-red-400 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400 animate-pulse" />
              <span>{slaBreachedCount}</span>
            </div>
            <span className="text-[10px] text-red-300/80 font-semibold mt-0.5 block">
              Shame Clock Triggered
            </span>
          </div>

          <div className="bg-[#181C28] p-3.5 rounded-2xl border border-[#1F2430]">
            <span className="text-[11px] uppercase font-bold text-[#9CA3AF] block mb-1">
              Proof-Verified Rate
            </span>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>{resolutionPercentage}%</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
              Citizen Validated
            </span>
          </div>

        </div>

      </div>

      {/* 3. Filter Matrix & Search Bar */}
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-4 space-y-3 shadow-lg">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Complaint Dispatch & Triage Filters</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case, city, officer, token..."
              className="w-full pl-9 pr-8 py-1.5 bg-[#181C28] border border-[#1F2430] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
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

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#1F2430]/60">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Corruption & Bribery">Corruption & Bribery</option>
              <option value="Water Problems">Water Problems</option>
              <option value="Sanitation & Gandgi">Sanitation & Gandgi</option>
              <option value="Parking & Roads">Parking & Roads</option>
              <option value="Gov Website Problem">Gov Website Problem</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">State Jurisdiction</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All States / Central</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Central Portal">Central Portals</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Urgency / SLA Tier</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Triage Tiers</option>
              <option value="Resolution Disputed">Resolution Disputed by Citizens (&lt;60%)</option>
              <option value="Escalated">Escalated (SLA Breached &gt; 7d)</option>
              <option value="Under Review">Under Investigation</option>
              <option value="Reported">Newly Reported</option>
              <option value="Resolved">Resolved & Proof Attached</option>
            </select>
          </div>
        </div>

      </div>

      {/* 4. Priority Triage Queue Table / Cards */}
      <div className="bg-[#12141D] rounded-3xl border border-[#1F2430] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2430]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              Public Grievance Action Queue ({sortedQueue.length})
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Ranked automatically by Severity, Public Impact Poll votes, and SLA Shame Clock duration.
            </p>
          </div>

          <span className="text-xs font-mono text-gray-400 bg-[#181C28] px-3 py-1 rounded-xl border border-[#1F2430] hidden sm:block">
            SLA Compliance Protocol Active
          </span>
        </div>

        <div className="space-y-3">
          {sortedQueue.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9CA3AF] bg-[#181C28]/40 rounded-2xl border border-[#1F2430] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">All matched grievances cleared!</p>
              <p>No complaints currently pending under this department or urgency filter.</p>
            </div>
          ) : (
            sortedQueue.map((post) => {
              const isResolved = post.status === 'Resolved';
              const isEscalated = post.status === 'Escalated';
              const isUnderReview = post.status === 'Under Review';

              return (
                <div
                  key={post.id}
                  className="bg-[#181C28] border border-[#1F2430] hover:border-blue-500/40 rounded-2xl p-4.5 transition-all space-y-3 shadow-md"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF4500]" />
                        s/{post.state} • {post.city}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-gray-400 bg-[#12141D] px-2 py-0.5 rounded border border-[#1F2430]">
                        {post.anonymousHash}
                      </span>
                      <span>•</span>
                      <span className="text-gray-400">
                        {post.category} &gt; <strong className="text-gray-200">{post.subCategory}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isResolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/40">
                          {post.verification ? `Resolved (${post.verification.approvalPercentage}% Verified)` : 'Resolved'}
                        </span>
                      ) : post.status === 'Resolution Disputed' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950/90 text-red-400 border border-red-500/50 animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Resolution Disputed ({post.verification?.approvalPercentage || 20}% &lt; 60%)
                        </span>
                      ) : post.status === 'Pending Verification' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending 60% Ground Verification
                        </span>
                      ) : isEscalated ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950/80 text-red-400 border border-red-500/40 animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Escalated (SLA Breached: {post.slaDays}d)
                        </span>
                      ) : isUnderReview ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/70 text-blue-400 border border-blue-500/40">
                          Under Investigation
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-400 border border-amber-500/40">
                          Pending Review ({post.slaDays}d)
                        </span>
                      )}

                      {post.bribeAmount && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-950/50 text-red-400 border border-red-500/40">
                          ₹{post.bribeAmount.toLocaleString('en-IN')} Bribe
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Incident Title & Brief */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* Telemetry / Urgency Indicator & Actions */}
                  <div className="pt-2 border-t border-[#1F2430] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 text-[#9CA3AF]">
                      <span>
                        Citizen Impact Poll: <strong className="text-white font-bold">{post.pollData.totalVotes}</strong> votes
                      </span>
                      <span>•</span>
                      <span>
                        Net Upvotes: <strong className="text-[#FF4500] font-bold">{post.upvotes - post.downvotes}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/post/${post.id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#12141D] hover:bg-[#1F2430] text-gray-300 font-semibold border border-[#1F2430] transition-colors flex items-center gap-1"
                      >
                        <span>Audit Trail</span>
                        <ExternalLink className="w-3 h-3 text-[#3B82F6]" />
                      </Link>

                      <button
                        onClick={() => handleOpenActionModal(post)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Take Official Action</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* 5. "Take Official Action" Executive Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12141D] rounded-3xl border border-blue-500/40 max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2430]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Issue Official Government Order</h3>
                  <span className="text-[11px] text-[#9CA3AF]">
                    Case Ref: {activePost.id} • {activePost.city}, s/{activePost.state}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#181C28]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Case Preview Card */}
            <div className="p-3 rounded-xl bg-[#181C28] border border-[#1F2430] space-y-1 text-xs">
              <span className="text-[#9CA3AF] block font-semibold text-[10px] uppercase">
                Active Public Grievance:
              </span>
              <p className="font-bold text-white line-clamp-1">{activePost.title}</p>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span>{activePost.category} &gt; {activePost.subCategory}</span>
                {activePost.bribeAmount && (
                  <span className="text-red-400 font-bold">₹{activePost.bribeAmount} Bribe Demanded</span>
                )}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              
              {/* Status Selector */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">New Resolution Status *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionStatus('Under Review')}
                    className={`py-2 px-2 rounded-xl font-bold border text-center transition-all ${
                      actionStatus === 'Under Review'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                        : 'bg-[#181C28] text-gray-400 border-[#1F2430]'
                    }`}
                  >
                    Under Investigation
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionStatus('Escalated')}
                    className={`py-2 px-2 rounded-xl font-bold border text-center transition-all ${
                      actionStatus === 'Escalated'
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-500/20'
                        : 'bg-[#181C28] text-gray-400 border-[#1F2430]'
                    }`}
                  >
                    Vigilance Escalated
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionStatus('Resolved')}
                    className={`py-2 px-2 rounded-xl font-bold border text-center transition-all ${
                      actionStatus === 'Resolved'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-[#181C28] text-gray-400 border-[#1F2430]'
                    }`}
                  >
                    Resolved & Verified
                  </button>
                </div>
              </div>

              {/* Authority Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Government Authority / Body</label>
                  <input
                    type="text"
                    value={authorityName}
                    onChange={(e) => setAuthorityName(e.target.value)}
                    required
                    className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Department / Zonal Cell</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Order Number & Officer Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Official Order / Dispatch No. *</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                    placeholder="e.g. BMC/SWM/2026/8492-B"
                    className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Designated Officer Role</label>
                  <input
                    type="text"
                    value={officerRole}
                    onChange={(e) => setOfficerRole(e.target.value)}
                    required
                    className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Official Public Statement */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Official Statement / Action Order Memo *
                </label>
                <textarea
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  placeholder="Detail the enquiry findings, contractor penalties, disciplinary suspension orders, or repair actions deployed..."
                  className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Proof-Based Resolution */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Resolution Proof Photo / Work Completion Document URL
                </label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b..."
                  className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-[#9CA3AF] mt-0.5 block">
                  Mandatory for closing grievances to "Resolved". Citizens must vote &gt;60% to affirm resolution.
                </span>
              </div>

              {/* Certification Checkbox */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="certify"
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="certify" className="text-[11px] text-blue-200 cursor-pointer leading-relaxed">
                  I hereby certify under Government Grievance Redressal Protocol that this order and accompanying evidence have been verified by competent departmental authority.
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="flex-1 py-3 rounded-xl bg-[#181C28] text-gray-300 font-semibold hover:bg-[#1F2430] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!certified}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Official Order</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
