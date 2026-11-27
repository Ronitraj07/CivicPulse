import React from 'react';
import { cn } from './cn';

type Tone = 'neutral' | 'accent' | 'blue' | 'green' | 'amber' | 'red';

const tones: Record<Tone, string> = {
  neutral: 'bg-civic-raised text-civic-muted border-civic-border',
  accent: 'bg-civic-accent/10 text-civic-accent border-civic-accent/30',
  blue: 'bg-civic-blue/10 text-civic-blue border-civic-blue/30',
  green: 'bg-civic-green/10 text-civic-green border-civic-green/30',
  amber: 'bg-civic-amber/10 text-civic-amber border-civic-amber/30',
  red: 'bg-civic-red/10 text-civic-red border-civic-red/30',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', className, ...props }) => (
  <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', tones[tone], className)} {...props} />
);
