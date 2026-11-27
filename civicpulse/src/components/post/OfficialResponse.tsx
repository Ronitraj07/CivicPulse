import React from 'react';
import { Building2, ExternalLink, ShieldQuestion, Check, CheckCheck, XCircle } from 'lucide-react';
import { Post } from '../../types';
import { Badge, Button, cn } from '../ui';

interface Props {
  post: Post;
  onVerify: (vote: 'verify' | 'dispute') => void;
}

export const OfficialResponse: React.FC<Props> = ({ post, onVerify }) => {
  const res = post.officialResponse;
  if (!res) return null;
  const v = post.verification;
  const passing = v ? v.approvalPercentage >= 60 : false;

  return (
    <section aria-label="Official response" className="mx-4 mb-3 space-y-2 rounded-xl border border-civic-blue/40 bg-civic-blue/10 p-3.5 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-civic-blue" aria-hidden="true" />
          <div>
            <span className="font-bold text-civic-text">{res.authorityName}</span>
            <span className="block text-[11px] text-civic-muted">{res.officerRole} • {res.department}</span>
          </div>
        </div>
        {res.actionOrderNumber && (
          <Badge tone="blue" className="font-mono">Order: {res.actionOrderNumber}</Badge>
        )}
      </div>

      <p className="text-xs italic leading-relaxed text-civic-text/90">“{res.statement}”</p>

      {res.proofUrl && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-civic-muted">Action proof:</span>
          <a href={res.proofUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 text-[11px] text-civic-blue hover:underline">
            Inspect official verification photo <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      )}

      {v && (
        <div className="mt-2.5 space-y-2 border-t border-civic-blue/30 pt-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-civic-text">
              <ShieldQuestion className="h-3.5 w-3.5 text-civic-blue" aria-hidden="true" />
              Community proof verification (60% rule)
            </span>
            <span className={cn('font-mono font-bold', passing ? 'text-civic-green' : 'text-civic-red')}>
              {v.approvalPercentage}% approved
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={v.approvalPercentage}
            aria-label="Community approval, 60 percent needed"
            className="relative h-2 w-full overflow-hidden rounded-full border border-civic-border bg-civic-dark"
          >
            <div
              className={cn('h-full transition-all duration-500 motion-reduce:transition-none', passing ? 'bg-civic-green' : 'bg-civic-red')}
              style={{ width: `${Math.min(100, Math.max(5, v.approvalPercentage))}%` }}
            />
            <div className="absolute inset-y-0 z-10 w-0.5 bg-civic-amber" style={{ left: '60%' }} title="60% acceptance threshold" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-civic-muted">
              {v.verifiedVotes} verified vs {v.disputedVotes} disputed ({v.totalVotes} votes)
            </span>
            {v.userVote ? (
              <Badge tone="green" className="font-semibold">
                <Check className="h-3 w-3" aria-hidden="true" />
                {v.userVote === 'verify' ? 'You verified the proof' : 'You disputed the claim'}
              </Badge>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => onVerify('verify')} title="Confirm the problem is genuinely resolved on the ground">
                  <CheckCheck className="h-3 w-3 text-civic-green" aria-hidden="true" /> Accept proof
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onVerify('dispute')} title="Report a fake photo or incomplete work">
                  <XCircle className="h-3 w-3 text-civic-red" aria-hidden="true" /> Dispute
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
