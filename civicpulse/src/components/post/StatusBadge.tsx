import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Post } from '../../types';
import { Badge } from '../ui';

export const StatusBadge: React.FC<{ post: Post }> = ({ post }) => {
  const pct = post.verification?.approvalPercentage;

  if (post.status === 'Resolved') {
    return (
      <Badge tone="green" className="font-semibold">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        {post.verification ? `Resolved (${pct}% verified)` : 'Resolved & verified'}
      </Badge>
    );
  }
  if (post.status === 'Resolution Disputed') {
    return (
      <Badge tone="red" className="font-bold">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        Resolution disputed ({pct || 20}% &lt; 60%)
      </Badge>
    );
  }
  if (post.status === 'Pending Verification') {
    return (
      <Badge tone="blue" className="font-bold">
        <Clock className="h-3 w-3" aria-hidden="true" />
        Awaiting 60% verification
      </Badge>
    );
  }
  if (post.slaDays >= 7) {
    return (
      <Badge tone="red" className="font-bold">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        Shame clock: {post.slaDays}d unresolved
      </Badge>
    );
  }
  if (post.status === 'Under Review') {
    return (
      <Badge tone="blue" className="font-semibold">
        <Clock className="h-3 w-3" aria-hidden="true" />
        Under investigation ({post.slaDays}d)
      </Badge>
    );
  }
  return (
    <Badge tone="amber" className="font-semibold">
      <Clock className="h-3 w-3" aria-hidden="true" />
      Reported ({post.slaDays}d)
    </Badge>
  );
};
