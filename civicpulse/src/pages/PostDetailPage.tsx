import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon,
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  Tag,
  IndianRupee,
  Building2,
  Check,
  Send,
  ThumbsUp,
  FileCheck2,
  Lock,
  CheckCheck,
  XCircle,
  ShieldQuestion
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    posts, 
    comments, 
    addComment, 
    voteComment, 
    votePost, 
    votePoll,
    voteResolutionVerification,
    setSelectedState,
    setSelectedCategory
  } = useCivic();

  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-12 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-[#181C28] text-gray-400 flex items-center justify-center mx-auto border border-[#1F2430]">
          <AlertOctagon className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Incident Report Not Found</h2>
        <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
          The requested tracking ID or report has expired or does not exist in the active public ledger.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF4500] hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-[#FF4500]/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Social Feed
        </Link>
      </div>
    );
  }

  const postComments = comments[post.id] || [];
  const isResolved = post.status === 'Resolved';
  const isEscalated = post.status === 'Escalated';
  const isUnderReview = post.status === 'Under Review';
  const netVotes = post.upvotes - post.downvotes;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors bg-[#12141D] px-3 py-1.5 rounded-xl border border-[#1F2430]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12141D] hover:bg-[#181C28] text-gray-200 text-xs font-semibold border border-[#1F2430] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Incident</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Incident Card */}
      <article className="bg-[#12141D] rounded-3xl border border-[#1F2430] p-6 space-y-6 shadow-2xl overflow-hidden">
        
        {/* Top Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F2430]">
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#9CA3AF]">
            <button
              onClick={() => {
                setSelectedState(post.state);
                navigate(`/s/${post.state}`);
              }}
              className="font-bold text-white hover:text-[#FF4500] flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF4500]" />
              s/{post.state}
            </button>

            <span>•</span>
            <span className="text-gray-300 font-medium">
              {post.city}{post.pincode ? ` (${post.pincode})` : ''}
            </span>

            <span>•</span>
            <span className="font-mono text-[11px] text-gray-400 bg-[#181C28] px-2 py-0.5 rounded-md border border-[#1F2430] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {post.anonymousHash}
            </span>

            <span>•</span>
            <span>{post.slaDays === 0 ? 'Logged Today' : `${post.slaDays} days ago`}</span>
          </div>

          {/* Status Badge */}
          <div>
            {isResolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolved & Verified
              </span>
            ) : isEscalated ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/70 text-red-400 border border-red-500/40 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Escalated (SLA Breached: {post.slaDays}d)
              </span>
            ) : isUnderReview ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950/70 text-blue-400 border border-blue-500/40">
                <Clock className="w-3.5 h-3.5" />
                Under Official Review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/70 text-amber-400 border border-amber-500/40">
                <Clock className="w-3.5 h-3.5" />
                Reported ({post.slaDays}d)
              </span>
            )}
          </div>
        </div>

        {/* Category & Tags Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedCategory(post.category);
              navigate('/');
            }}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#181C28] text-gray-200 border border-[#1F2430] hover:border-gray-500 flex items-center gap-1.5 transition-colors"
          >
            <Tag className="w-3 h-3 text-[#FF4500]" />
            <span>{post.category}</span>
            <span className="text-gray-500">&gt;</span>
            <span className="text-orange-300">{post.subCategory}</span>
          </button>

          {post.bribeAmount !== undefined && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-950/50 text-red-400 border border-red-500/40 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              ₹{post.bribeAmount.toLocaleString('en-IN')} Cash Demanded
            </span>
          )}

          {post.exifStripped && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              EXIF Stripped & Protected
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
          {post.title}
        </h1>

        {/* Full Narrative Text */}
        <div className="prose prose-invert max-w-none text-sm text-gray-200 leading-relaxed whitespace-pre-line bg-[#181C28]/40 p-4 rounded-2xl border border-[#1F2430]">
          {post.description}
        </div>

        {/* High-Resolution Evidence Media Gallery */}
        {post.mediaUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">
                Citizen Whistleblower Evidence:
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> GPS & Metadata Scrubbed
              </span>
            </div>

            <div 
              onClick={() => setLightboxOpen(true)}
              className="relative rounded-2xl overflow-hidden border border-[#1F2430] bg-black cursor-pointer group"
            >
              <img
                src={post.mediaUrl}
                alt="Incident Evidence"
                className="w-full max-h-[460px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                  Click to inspect full high-resolution evidence <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[11px] text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Whistleblower Protected (GPS / Serial Sanitized)
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxOpen && post.mediaUrl && (
          <div 
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full">
              <img
                src={post.mediaUrl}
                alt="Enlarged evidence"
                className="w-full max-h-[85vh] object-contain rounded-2xl border border-gray-700"
              />
              <p className="text-center text-xs text-gray-400 mt-2">
                Click anywhere to close full preview
              </p>
            </div>
          </div>
        )}

        {/* 3. Interactive "Me Too / Affected" Community Poll */}
        <div className="bg-[#181C28] p-5 rounded-2xl border border-[#1F2430] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4500] animate-ping" />
              <h3 className="font-bold text-white text-sm">
                {post.pollData.question}
              </h3>
            </div>
            <span className="text-[11px] text-[#9CA3AF] bg-[#12141D] px-2.5 py-1 rounded-lg border border-[#1F2430]">
              {post.pollData.totalVotes.toLocaleString('en-IN')} total votes
            </span>
          </div>

          <div className="space-y-2.5">
            {post.pollData.options.map((opt) => {
              const total = post.pollData.totalVotes;
              const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              const hasVoted = Boolean(post.pollData.userVotedOptionId);
              const isSelected = post.pollData.userVotedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  disabled={hasVoted}
                  onClick={() => votePoll(post.id, opt.id)}
                  className={`w-full relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-[#FF4500] bg-[#FF4500]/10 ring-1 ring-[#FF4500]'
                      : hasVoted
                      ? 'border-[#1F2430] bg-[#12141D] opacity-90 cursor-default'
                      : 'border-[#1F2430] bg-[#12141D] hover:border-gray-500 hover:bg-[#161922] cursor-pointer'
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 bottom-0 rounded-xl transition-all duration-500 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FF4500]/30 to-[#FF4500]/20'
                        : 'bg-gradient-to-r from-gray-700/20 to-gray-800/10'
                    }`}
                    style={{ width: `${pct}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#FF4500] bg-[#FF4500] text-white'
                            : 'border-gray-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className={isSelected ? 'text-white font-bold' : 'text-gray-300'}>
                        {opt.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#9CA3AF]">{opt.votes} votes</span>
                      <span className="font-mono font-bold text-[#FF4500]">{pct}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] pt-1">
            <span>Votes act as urgency multiplier for state vigilance triage</span>
            {post.pollData.userVotedOptionId && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Anonymous vote logged
              </span>
            )}
          </div>
        </div>

        {/* 4. Action & Escalation Timeline (Audit Trail) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#FF4500]" />
              Corruption & Action Timeline (Public Audit Trail)
            </h3>
            <span className="text-[11px] text-gray-400 font-mono">
              Immutable Trail
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1F2430]">
            {post.auditTrail.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';

              return (
                <div key={step.id || idx} className="relative group">
                  {/* Status Indicator Node */}
                  <div
                    className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full border-4 border-[#12141D] flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isInProgress
                        ? 'bg-[#FF4500] text-white animate-pulse'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  <div className="bg-[#181C28] p-3.5 rounded-2xl border border-[#1F2430] space-y-1 group-hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isCompleted ? 'text-white' : isInProgress ? 'text-[#FF4500]' : 'text-gray-400'}`}>
                        {idx + 1}. {step.title}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] bg-[#12141D] px-2 py-0.5 rounded border border-[#1F2430]">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upvote & Action Bar */}
        <div className="pt-4 border-t border-[#1F2430] flex items-center justify-between">
          <div className="flex items-center bg-[#181C28] rounded-xl border border-[#1F2430] overflow-hidden">
            <button
              onClick={() => votePost(post.id, 'up')}
              className={`p-2 hover:bg-[#1F2430] transition-colors ${
                post.userVote === 'up' ? 'text-[#FF4500] bg-[#FF4500]/15' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowBigUp className="w-5 h-5" />
            </button>
            <span className={`px-3 text-sm font-bold font-mono ${
              post.userVote === 'up' ? 'text-[#FF4500]' : post.userVote === 'down' ? 'text-blue-400' : 'text-gray-200'
            }`}>
              {netVotes}
            </span>
            <button
              onClick={() => votePost(post.id, 'down')}
              className={`p-2 hover:bg-[#1F2430] transition-colors ${
                post.userVote === 'down' ? 'text-blue-400 bg-blue-500/15' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowBigDown className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#FF4500]" />
            <span>{postComments.length} Citizen Responses</span>
          </div>
        </div>

      </article>

      {/* 5. Official Government Response Box (Top of Discussion) */}
      {post.officialResponse && (
        <section className="bg-gradient-to-r from-blue-950/40 via-[#12141D] to-[#12141D] rounded-3xl border-2 border-blue-500/60 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Official Authority Resolution Response</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                    Verified Officer
                  </span>
                </h3>
                <p className="text-xs text-blue-300/80">
                  {post.officialResponse.authorityName} • {post.officialResponse.department}
                </p>
              </div>
            </div>

            {post.officialResponse.actionOrderNumber && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-blue-300/80 block">Order / Dispatch #</span>
                <span className="font-mono text-xs font-bold text-blue-200 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-500/40">
                  {post.officialResponse.actionOrderNumber}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-200 block">Official Statement:</span>
            <p className="text-sm text-gray-200 leading-relaxed italic bg-[#181C28]/60 p-4 rounded-xl border border-blue-500/20">
              "{post.officialResponse.statement}"
            </p>
          </div>

          {/* Proof-Based Resolution & Verification Loop */}
          {post.officialResponse.proofUrl && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  Official Proof of Action / After-Resolution Evidence:
                </span>
                <span className="text-[10px] text-gray-400">
                  Responded: {new Date(post.officialResponse.respondedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 max-h-80 bg-black">
                <img
                  src={post.officialResponse.proofUrl}
                  alt="Official resolution proof"
                  className="w-full max-h-80 object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-[11px] text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Official Evidence Uploaded by Authority</span>
                </div>
              </div>

              {/* The 60% Community Proof Verification Loop */}
              <div className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                post.verification?.approvalPercentage && post.verification.approvalPercentage >= 60
                  ? 'bg-emerald-950/25 border-emerald-500/40'
                  : post.verification?.isDisputed
                  ? 'bg-red-950/30 border-red-500/50'
                  : 'bg-[#181C28] border-blue-500/30'
              }`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldQuestion className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>The 60% Proof Verification Loop</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gray-300 border border-gray-700">
                          Mandatory Rule
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#9CA3AF]">
                        Official cannot close grievance without &ge;60% community ballot consensus.
                      </p>
                    </div>
                  </div>

                  {/* Verdict Badge */}
                  <div>
                    {post.verification?.isCertified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Resolution Certified ({post.verification.approvalPercentage}%)
                      </span>
                    ) : post.verification?.isDisputed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-500/50 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Resolution Vetoed ({post.verification.approvalPercentage}% &lt; 60%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">
                        <Clock className="w-3.5 h-3.5" />
                        Verification In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Meter Bar with 60% Target Benchmark Line */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">Citizen Ground Consensus Approval:</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-sm ${
                        (post.verification?.approvalPercentage || 0) >= 60 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {post.verification?.approvalPercentage ?? 100}% Positive
                      </span>
                      <span className="text-[10px] text-yellow-400 font-bold bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-500/30">
                        Benchmark: 60%
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-3 rounded-full bg-gray-900 overflow-hidden border border-gray-700">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${
                        (post.verification?.approvalPercentage || 0) >= 60 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, post.verification?.approvalPercentage ?? 100))}%` }}
                    />
                    {/* 60% Needle Benchmark */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10 shadow-glow" 
                      style={{ left: '60%' }} 
                      title="60% Community Acceptance Threshold"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] pt-0.5">
                    <span>0% (Fake Claim)</span>
                    <span className="font-bold text-yellow-400">▲ 60% Threshold (Auto-Escalate below this)</span>
                    <span>100% (Certified Genuine)</span>
                  </div>
                </div>

                {/* Verification Voting Actions */}
                <div className="bg-[#12141D] p-3.5 rounded-xl border border-[#1F2430] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white block">Did authorities genuinely fix this on ground?</span>
                    <span className="text-[11px] text-gray-400">
                      Tally: <strong className="text-emerald-400">{post.verification?.verifiedVotes || 0}</strong> Verified vs <strong className="text-red-400">{post.verification?.disputedVotes || 0}</strong> Disputed ({post.verification?.totalVotes || 0} citizen ballots)
                    </span>
                  </div>

                  <div>
                    {post.verification?.userVote ? (
                      <div className="flex items-center gap-2 bg-[#181C28] px-3 py-1.5 rounded-xl border border-gray-700">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-gray-200 text-xs font-semibold">
                          Your vote: <strong className={post.verification.userVote === 'verify' ? 'text-emerald-400' : 'text-red-400'}>
                            {post.verification.userVote === 'verify' ? 'Verified Clean (Proof Accepted)' : 'Disputed (Fake / Incomplete)'}
                          </strong>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => voteResolutionVerification(post.id, 'verify')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <CheckCheck className="w-4 h-4" />
                          <span>Accept Proof (Verified)</span>
                        </button>

                        <button
                          onClick={() => voteResolutionVerification(post.id, 'dispute')}
                          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Dispute / Fake Claim</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanation Banner */}
                {post.verification?.isDisputed && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Community Veto Enforced:</strong> Citizen approval has fallen below the 60% threshold. The department's resolution order has been invalidated and the case has been automatically re-escalated to the Higher Vigilance Commission.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </section>
      )}

      {/* 6. Anonymous Discussion & Corroboration Thread */}
      <section className="bg-[#12141D] rounded-3xl border border-[#1F2430] p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2430]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#FF4500]" />
              Anonymous Citizen Discussion ({postComments.length})
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Corroborate evidence, share similar ward experiences, or report follow-up updates.
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Lock className="w-3 h-3" /> Zero IP Tracked
          </span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#181C28] text-gray-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 border border-[#1F2430]">
              You
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your experience in this locality, name other affected spots, or corroborate officer demands..."
                className="w-full bg-[#181C28] border border-[#1F2430] rounded-2xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF4500] transition-colors leading-relaxed"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#9CA3AF]">
                  Posting anonymously under a rotating one-time hash
                </span>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-[#FF4500] hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#FF4500]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Anonymous Testimony</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-3 pt-2">
          {postComments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9CA3AF] bg-[#181C28]/40 rounded-2xl border border-[#1F2430]">
              No testimonies yet. Be the first citizen to corroborate this report!
            </div>
          ) : (
            postComments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#181C28] border border-[#1F2430] hover:border-[#2D3748] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-200 bg-[#12141D] px-2 py-0.5 rounded border border-[#1F2430] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {c.anonymousHash}
                    </span>
                    <span>•</span>
                    <span className="text-[11px]">{c.createdAt}</span>
                  </div>

                  <button
                    onClick={() => voteComment(post.id, c.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12141D] hover:bg-[#181C28] text-gray-300 hover:text-[#FF4500] border border-[#1F2430] text-[11px] font-semibold transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{c.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed pl-1">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>

      </section>

    </div>
  );
};
