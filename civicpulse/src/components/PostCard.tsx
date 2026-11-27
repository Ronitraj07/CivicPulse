import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowBigUp, ArrowBigDown, MessageSquare, Share2, ExternalLink, Tag, IndianRupee, Check, Flame } from 'lucide-react';
import { Post } from '../types';
import { useCivic } from '../context/CivicContext';
import { Badge, Card, cn } from './ui';
import { StatusBadge } from './post/StatusBadge';
import { ImpactPoll } from './post/ImpactPoll';
import { OfficialResponse } from './post/OfficialResponse';

interface PostCardProps {
  post: Post;
}

const DESC_LIMIT = 220;
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-accent';
const pillBtn = `flex min-h-[36px] items-center gap-1.5 rounded-xl border border-civic-border bg-civic-surface px-3 font-medium text-civic-text/90 transition-colors hover:bg-civic-hover ${focusRing}`;

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { votePost, votePoll, voteResolutionVerification, setSelectedState, setSelectedCategory } = useCivic();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const userVote = post.userVote;
  const netVotes = post.upvotes - post.downvotes;
  const isLong = post.description.length > DESC_LIMIT;

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="group flex flex-col overflow-hidden transition-colors hover:border-civic-muted/40">
      <article className="flex flex-col">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-civic-border/60 p-4 pb-2.5 text-xs text-civic-muted">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { setSelectedState(post.state); navigate('/'); }}
              className={`flex items-center gap-1 rounded font-bold text-civic-text hover:text-civic-accent ${focusRing}`}
            >
              <MapPin className="h-3.5 w-3.5 text-civic-accent" aria-hidden="true" />
              s/{post.state}
            </button>
            <span aria-hidden="true">•</span>
            <span className="font-medium text-civic-text/80">
              {post.city}{post.pincode ? ` (${post.pincode})` : ''}
            </span>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1 rounded-md border border-civic-border bg-civic-raised px-2 py-0.5 font-mono text-[11px]">
              <ShieldCheck className="h-3 w-3 text-civic-green" aria-hidden="true" />
              {post.anonymousHash}
            </span>
            <span aria-hidden="true">•</span>
            <span className="text-[11px]">{post.slaDays === 0 ? 'Today' : `${post.slaDays}d ago`}</span>
          </div>
          <StatusBadge post={post} />
        </header>

        <div className="flex flex-wrap items-center gap-2 px-4 pb-1 pt-3">
          <button
            type="button"
            onClick={() => { setSelectedCategory(post.category); navigate('/'); }}
            className={`flex items-center gap-1.5 rounded-full border border-civic-border bg-civic-raised px-2.5 py-1 text-[11px] font-semibold text-civic-text/90 transition-colors hover:bg-civic-hover ${focusRing}`}
          >
            <Tag className="h-3 w-3 text-civic-accent" aria-hidden="true" />
            {post.category}
            <span className="text-civic-muted" aria-hidden="true">&gt;</span>
            <span className="text-civic-amber">{post.subCategory}</span>
          </button>

          {post.bribeAmount !== undefined && (
            <Badge tone="red" className="px-2.5 py-1 font-bold">
              <IndianRupee className="h-3 w-3" aria-hidden="true" />
              {post.bribeAmount.toLocaleString('en-IN')} cash demanded
            </Badge>
          )}
          {post.exifStripped && (
            <Badge tone="green">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" /> EXIF stripped
            </Badge>
          )}
          {post.status === 'Escalated' && (
            <Badge tone="red" className="font-bold">
              <Flame className="h-3 w-3" aria-hidden="true" /> Urgent citizen priority
            </Badge>
          )}
        </div>

        <div className="space-y-2 px-4 py-2.5">
          <Link to={`/post/${post.id}`} className={`block rounded ${focusRing}`}>
            <h2 className="text-base font-bold leading-snug text-civic-text transition-colors hover:text-civic-accent sm:text-lg">
              {post.title}
            </h2>
          </Link>
          <p className="text-sm leading-relaxed text-civic-text/80">
            {expanded || !isLong ? post.description : `${post.description.slice(0, DESC_LIMIT)}… `}
            {isLong && (
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
                className={`ml-1 inline rounded text-xs font-semibold text-civic-accent hover:underline ${focusRing}`}
              >
                {expanded ? 'Show less' : 'Read full report'}
              </button>
            )}
          </p>
        </div>

        {post.mediaUrl && (
          <div className="px-4 py-2">
            <div className="relative overflow-hidden rounded-xl border border-civic-border bg-black">
              <img
                src={post.mediaUrl}
                alt={`Evidence photo for: ${post.title}`}
                className="h-auto max-h-80 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border border-civic-green/30 bg-black/80 px-2.5 py-1 text-[10px] font-semibold text-civic-green backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Metadata stripped • whistleblower protected
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-3">
          <ImpactPoll poll={post.pollData} onVote={(optionId) => votePoll(post.id, optionId)} />
        </div>

        <OfficialResponse post={post} onVerify={(vote) => voteResolutionVerification(post.id, vote)} />

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-civic-border bg-civic-raised/50 p-3 text-xs text-civic-muted">
          <div className="flex items-center gap-2">
            <div className="flex items-center overflow-hidden rounded-xl border border-civic-border bg-civic-surface" role="group" aria-label="Vote on this issue">
              <button
                type="button"
                aria-pressed={userVote === 'up'}
                aria-label="Upvote issue"
                onClick={() => votePost(post.id, 'up')}
                className={cn('flex min-h-[36px] min-w-[36px] items-center justify-center transition-colors hover:bg-civic-hover', focusRing, userVote === 'up' ? 'bg-civic-accent/15 text-civic-accent' : 'text-civic-muted hover:text-civic-text')}
              >
                <ArrowBigUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className={cn('px-2 font-mono text-xs font-bold', userVote === 'up' ? 'text-civic-accent' : userVote === 'down' ? 'text-civic-blue' : 'text-civic-text')} aria-label={`${netVotes} net votes`}>
                {netVotes}
              </span>
              <button
                type="button"
                aria-pressed={userVote === 'down'}
                aria-label="Downvote issue"
                onClick={() => votePost(post.id, 'down')}
                className={cn('flex min-h-[36px] min-w-[36px] items-center justify-center transition-colors hover:bg-civic-hover', focusRing, userVote === 'down' ? 'bg-civic-blue/15 text-civic-blue' : 'text-civic-muted hover:text-civic-text')}
              >
                <ArrowBigDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Link to={`/post/${post.id}`} className={pillBtn}>
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {post.commentsCount} comments
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={handleShare} className={pillBtn} title="Share incident report" aria-live="polite">
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-civic-green" aria-hidden="true" />
                  <span className="font-semibold text-civic-green">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <Link to={`/post/${post.id}`} className={cn(pillBtn, 'bg-civic-raised font-bold')}>
              View audit trail
              <ExternalLink className="h-3 w-3 text-civic-accent" aria-hidden="true" />
            </Link>
          </div>
        </footer>
      </article>
    </Card>
  );
};
