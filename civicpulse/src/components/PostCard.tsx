import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  Tag,
  IndianRupee,
  Building2,
  Check,
  Flame,
  CheckCheck,
  XCircle,
  ShieldQuestion
} from 'lucide-react';
import { Post } from '../types';
import { useCivic } from '../context/CivicContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { votePost, votePoll, voteResolutionVerification, setSelectedState, setSelectedCategory } = useCivic();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isEscalated = post.status === 'Escalated';
  const isUnderReview = post.status === 'Under Review';

  const userVote = post.userVote;
  const netVotes = post.upvotes - post.downvotes;

  const handleVote = (direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    votePost(post.id, direction);
  };

  const handlePollVote = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    votePoll(post.id, optionId);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedState(post.state);
    navigate('/');
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(post.category);
    navigate('/');
  };

  // Format SLA label
  const getSlaBadge = () => {
    if (post.status === 'Resolved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          {post.verification ? `Resolved (${post.verification.approvalPercentage}% Verified)` : 'Resolved & Verified'}
        </span>
      );
    }

    if (post.status === 'Resolution Disputed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950/90 text-red-400 border border-red-500/60 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          Resolution Disputed ({post.verification?.approvalPercentage || 20}% &lt; 60%)
        </span>
      );
    }

    if (post.status === 'Pending Verification') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/70 text-purple-300 border border-purple-500/40">
          <Clock className="w-3 h-3" />
          Awaiting 60% Verification
        </span>
      );
    }

    if (post.slaDays >= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950/70 text-red-400 border border-red-500/40 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          Shame Clock: {post.slaDays}d Unresolved
        </span>
      );
    }

    if (isUnderReview) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-500/30">
          <Clock className="w-3 h-3" />
          Under Investigation ({post.slaDays}d)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" />
        Reported ({post.slaDays}d)
      </span>
    );
  };

  return (
    <article className="bg-[#12141D] rounded-2xl border border-[#1F2430] hover:border-[#2D3748] transition-all overflow-hidden flex flex-col group shadow-lg">
      
      {/* 1. Header Metadata Bar */}
      <div className="p-4 pb-2.5 flex items-center justify-between text-xs text-[#9CA3AF] border-b border-[#1F2430]/60">
        <div className="flex items-center gap-2 flex-wrap">
          {/* State Community Badge */}
          <button
            onClick={handleStateClick}
            className="flex items-center gap-1 font-bold text-white hover:text-[#FF4500] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF4500]" />
            <span>s/{post.state}</span>
          </button>
          
          <span className="text-gray-500">•</span>
          
          <span className="text-gray-300 font-medium">
            {post.city}
            {post.pincode ? ` (${post.pincode})` : ''}
          </span>
          
          <span className="text-gray-500">•</span>
          
          {/* Whistleblower Anonymous Hash */}
          <span className="font-mono text-[11px] text-gray-400 bg-[#181C28] px-2 py-0.5 rounded-md border border-[#1F2430] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {post.anonymousHash}
          </span>
          
          <span className="text-gray-500">•</span>
          
          <span className="text-[11px]">
            {post.slaDays === 0 ? 'Today' : `${post.slaDays}d ago`}
          </span>
        </div>

        {/* SLA Status Badge */}
        <div>{getSlaBadge()}</div>
      </div>

      {/* 2. Category & Tag Pills */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap">
        <button
          onClick={handleCategoryClick}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#181C28] text-gray-300 hover:text-white hover:bg-[#1F2430] border border-[#1F2430] flex items-center gap-1.5 transition-colors"
        >
          <Tag className="w-3 h-3 text-[#FF4500]" />
          <span>{post.category}</span>
          <span className="text-gray-500">&gt;</span>
          <span className="text-orange-300">{post.subCategory}</span>
        </button>

        {post.bribeAmount !== undefined && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-950/50 text-red-400 border border-red-500/30 flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            ₹{post.bribeAmount.toLocaleString('en-IN')} Cash Demanded
          </span>
        )}

        {post.exifStripped && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            EXIF Stripped
          </span>
        )}

        {isEscalated && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-400" />
            Urgent Citizen Priority
          </span>
        )}
      </div>

      {/* 3. Title & Narrative */}
      <div className="px-4 py-2.5 space-y-2">
        <Link to={`/post/${post.id}`} className="block group/title">
          <h2 className="text-base sm:text-lg font-bold text-white group-hover/title:text-[#FF4500] transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          {isExpanded || post.description.length <= 220
            ? post.description
            : `${post.description.slice(0, 220)}... `}
          {post.description.length > 220 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#FF4500] text-xs font-semibold hover:underline inline-block ml-1"
            >
              {isExpanded ? 'Show less' : 'Read full report'}
            </button>
          )}
        </p>
      </div>

      {/* 4. Evidence Media Preview */}
      {post.mediaUrl && (
        <div className="px-4 py-2">
          <div className="relative rounded-xl overflow-hidden border border-[#1F2430] bg-black group/img">
            <img
              src={post.mediaUrl}
              alt="Citizen Whistleblower Evidence"
              className="w-full h-auto max-h-80 object-cover group-hover/img:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            {/* Whistleblower Shield Watermark Badge */}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-EXIF Metadata Stripped • Whistleblower Protected</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Killer Feature: Interactive "Me Too / Affected" Impact Poll */}
      <div className="px-4 py-3">
        <div className="bg-[#181C28]/95 p-4 rounded-xl border border-[#1F2430] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF4500] animate-ping" />
              <span className="font-bold text-gray-100">
                {post.pollData.question}
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#9CA3AF] bg-[#12141D] px-2 py-0.5 rounded border border-[#1F2430]">
              {post.pollData.totalVotes.toLocaleString('en-IN')} votes
            </span>
          </div>

          {/* Poll Options */}
          <div className="space-y-2">
            {post.pollData.options.map((opt) => {
              const total = post.pollData.totalVotes;
              const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              const hasVoted = Boolean(post.pollData.userVotedOptionId);
              const isSelected = post.pollData.userVotedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  disabled={hasVoted}
                  onClick={(e) => handlePollVote(opt.id, e)}
                  className={`w-full relative overflow-hidden rounded-xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-[#FF4500] bg-[#FF4500]/10 ring-1 ring-[#FF4500]'
                      : hasVoted
                      ? 'border-[#1F2430] bg-[#12141D] opacity-90 cursor-default'
                      : 'border-[#1F2430] bg-[#12141D] hover:border-gray-500 hover:bg-[#161922] cursor-pointer'
                  }`}
                >
                  {/* Visual Progress Percentage Bar */}
                  <div
                    className={`absolute top-0 left-0 bottom-0 rounded-xl transition-all duration-500 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FF4500]/30 to-[#FF4500]/20'
                        : 'bg-gradient-to-r from-gray-700/20 to-gray-800/10'
                    }`}
                    style={{ width: `${pct}%` }}
                  />

                  {/* Content inside Option */}
                  <div className="relative z-10 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
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
                      <span className="text-[11px] text-[#9CA3AF]">
                        {opt.votes}
                      </span>
                      <span className="font-mono font-bold text-[#FF4500]">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] pt-1">
            <span>Click option to cast anonymous area vote</span>
            {post.pollData.userVotedOptionId && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Your vote recorded in local ledger
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 6. Official Government Response Box (if present) */}
      {post.officialResponse && (
        <div className="mx-4 mb-3 p-3.5 rounded-xl bg-blue-950/25 border border-blue-500/40 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="font-bold text-blue-200">
                  {post.officialResponse.authorityName}
                </span>
                <span className="text-[10px] text-blue-300/80 block">
                  {post.officialResponse.officerRole} • {post.officialResponse.department}
                </span>
              </div>
            </div>

            {post.officialResponse.actionOrderNumber && (
              <span className="font-mono text-[10px] text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-500/30">
                Order: {post.officialResponse.actionOrderNumber}
              </span>
            )}
          </div>

          <p className="text-blue-100 text-xs leading-relaxed italic">
            "{post.officialResponse.statement}"
          </p>

          {post.officialResponse.proofUrl && (
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[10px] text-blue-300 font-semibold">Action Proof:</span>
              <a
                href={post.officialResponse.proofUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-mono"
              >
                Inspect official verification photo <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* 60% Community Proof Verification Loop Widget */}
          {post.verification && (
            <div className="mt-2.5 pt-2.5 border-t border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-gray-200">
                  <ShieldQuestion className="w-3.5 h-3.5 text-blue-400" />
                  <span>Community Proof Verification (60% Rule):</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${
                    post.verification.approvalPercentage >= 60 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {post.verification.approvalPercentage}% Approved
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-gray-400 border border-gray-700">
                    Target: ≥60%
                  </span>
                </div>
              </div>

              {/* Threshold Meter Bar with 60% Indicator Line */}
              <div className="relative w-full h-2 rounded-full bg-gray-900 overflow-hidden border border-gray-700">
                <div
                  className={`h-full transition-all duration-500 ${
                    post.verification.approvalPercentage >= 60 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, post.verification.approvalPercentage))}%` }}
                />
                {/* 60% Target Benchmark Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10" 
                  style={{ left: '60%' }} 
                  title="60% Community Acceptance Threshold"
                />
              </div>

              {/* Vote Actions for Citizens */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-gray-400">
                  {post.verification.verifiedVotes} Verified vs {post.verification.disputedVotes} Disputed ({post.verification.totalVotes} votes)
                </span>

                <div className="flex items-center gap-1.5">
                  {post.verification.userVote ? (
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                      {post.verification.userVote === 'verify' ? 'You Verified Proof' : 'You Disputed Claim'}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          voteResolutionVerification(post.id, 'verify');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Confirm that the problem is genuinely resolved on ground"
                      >
                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                        <span>Accept Proof</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          voteResolutionVerification(post.id, 'dispute');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Veto resolution: Report fake photo or incomplete work on ground"
                      >
                        <XCircle className="w-3 h-3 text-red-400" />
                        <span>Dispute / Fake</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Reddit-Style Footer Actions */}
      <div className="p-3 bg-[#181C28]/50 border-t border-[#1F2430] flex items-center justify-between text-xs text-[#9CA3AF]">
        
        {/* Left: Vote counter + Comments */}
        <div className="flex items-center gap-2">
          
          {/* Reddit-style Upvote/Downvote Pill */}
          <div className="flex items-center bg-[#12141D] rounded-xl border border-[#1F2430] overflow-hidden">
            <button
              onClick={(e) => handleVote('up', e)}
              className={`p-1.5 hover:bg-[#181C28] transition-colors ${
                userVote === 'up' ? 'text-[#FF4500] bg-[#FF4500]/15' : 'text-gray-400 hover:text-white'
              }`}
              title="Upvote issue"
            >
              <ArrowBigUp className="w-4 h-4" />
            </button>

            <span className={`px-2 text-xs font-bold font-mono ${
              userVote === 'up' ? 'text-[#FF4500]' : userVote === 'down' ? 'text-blue-400' : 'text-gray-200'
            }`}>
              {netVotes}
            </span>

            <button
              onClick={(e) => handleVote('down', e)}
              className={`p-1.5 hover:bg-[#181C28] transition-colors ${
                userVote === 'down' ? 'text-blue-400 bg-blue-500/15' : 'text-gray-400 hover:text-white'
              }`}
              title="Downvote issue"
            >
              <ArrowBigDown className="w-4 h-4" />
            </button>
          </div>

          {/* Comment Count Button */}
          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12141D] hover:bg-[#181C28] text-gray-300 font-medium border border-[#1F2430] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentsCount} Comments</span>
          </Link>

        </div>

        {/* Right: Share + Audit Trail */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12141D] hover:bg-[#181C28] text-gray-300 font-medium border border-[#1F2430] transition-colors"
            title="Share incident report"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C28] hover:bg-[#1F2430] text-gray-200 text-xs font-bold border border-[#1F2430] transition-colors group-hover:border-[#FF4500]/40"
          >
            <span>View Audit Trail</span>
            <ExternalLink className="w-3 h-3 text-[#FF4500]" />
          </Link>
        </div>

      </div>

    </article>
  );
};
