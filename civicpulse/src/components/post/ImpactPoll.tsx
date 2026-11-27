import React from 'react';
import { Check } from 'lucide-react';
import { Post } from '../../types';
import { cn } from '../ui';

interface Props {
  poll: Post['pollData'];
  onVote: (optionId: string) => void;
}

export const ImpactPoll: React.FC<Props> = ({ poll, onVote }) => {
  const hasVoted = Boolean(poll.userVotedOptionId);

  return (
    <section aria-label="Impact poll" className="space-y-3 rounded-xl border border-civic-border bg-civic-raised p-4">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-civic-accent motion-safe:animate-ping" aria-hidden="true" />
          <span className="font-bold text-civic-text">{poll.question}</span>
        </div>
        <span className="rounded border border-civic-border bg-civic-surface px-2 py-0.5 text-[11px] font-medium text-civic-muted">
          {poll.totalVotes.toLocaleString('en-IN')} votes
        </span>
      </div>

      <div className="space-y-2">
        {poll.options.map((opt) => {
          const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
          const selected = poll.userVotedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={hasVoted}
              aria-pressed={selected}
              onClick={() => onVote(opt.id)}
              className={cn(
                'relative min-h-[44px] w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-accent',
                selected
                  ? 'border-civic-accent bg-civic-accent/10'
                  : hasVoted
                  ? 'cursor-default border-civic-border bg-civic-surface'
                  : 'cursor-pointer border-civic-border bg-civic-surface hover:border-civic-muted',
              )}
            >
              <span
                aria-hidden="true"
                className={cn('absolute inset-y-0 left-0 transition-all duration-500 motion-reduce:transition-none', selected ? 'bg-civic-accent/25' : 'bg-civic-muted/10')}
                style={{ width: `${pct}%` }}
              />
              <span className="relative z-10 flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2">
                  <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full border', selected ? 'border-civic-accent bg-civic-accent text-white' : 'border-civic-muted/60')}>
                    {selected && <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />}
                  </span>
                  <span className={selected ? 'font-bold text-civic-text' : 'text-civic-text/80'}>{opt.label}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[11px] text-civic-muted">{opt.votes}</span>
                  <span className="font-mono font-bold text-civic-accent">{pct}%</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px] text-civic-muted">
        <span>Select an option to cast an anonymous area vote</span>
        {hasVoted && (
          <span className="flex items-center gap-1 font-semibold text-civic-green">
            <Check className="h-3 w-3" aria-hidden="true" /> Vote recorded
          </span>
        )}
      </div>
    </section>
  );
};
