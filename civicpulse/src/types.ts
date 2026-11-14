export type PostCategory = 
  | 'Corruption & Bribery'
  | 'Water Problems'
  | 'Sanitation & Gandgi'
  | 'Parking & Roads'
  | 'Gov Website Problem';

export type PostStatus = 
  | 'Reported' 
  | 'Under Review' 
  | 'Escalated' 
  | 'Pending Verification' 
  | 'Resolved' 
  | 'Resolution Disputed';

export type PortalCondition = 'Operational' | 'Degraded' | 'Down';

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface PollData {
  question: string;
  totalVotes: number;
  userVotedOptionId?: string;
  options: PollOption[];
}

export interface ResolutionVerification {
  verifiedVotes: number;      // Citizens voting "Yes, Verified Clean"
  disputedVotes: number;      // Citizens voting "No, Fake / Incomplete"
  totalVotes: number;
  userVote?: 'verify' | 'dispute';
  approvalPercentage: number;  // e.g. 88
  isCertified: boolean;        // approvalPercentage >= 60 && totalVotes >= 3
  isDisputed: boolean;         // approvalPercentage < 60 && totalVotes >= 3
}

export interface OfficialResponse {
  authorityName: string;
  department: string;
  officerRole: string;
  statement: string;
  actionOrderNumber?: string;
  proofUrl?: string;
  respondedAt: string;
  isVerifiedAction: boolean;
  verification?: ResolutionVerification;
}

export interface AuditStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Comment {
  id: string;
  postId: string;
  anonymousHash: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface Post {
  id: string;
  anonymousHash: string;
  state: string;
  city: string;
  pincode?: string;
  category: PostCategory;
  subCategory: string;
  title: string;
  description: string;
  mediaUrl?: string;
  exifStripped: boolean;
  bribeAmount?: number;
  status: PostStatus;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  commentsCount: number;
  createdAt: string;
  slaDays: number;
  pollData: PollData;
  officialResponse?: OfficialResponse;
  verification?: ResolutionVerification;
  auditTrail: AuditStep[];
}

export interface PortalStatus {
  id: string;
  portalName: string;
  category: 'Central' | 'State';
  url: string;
  status: PortalCondition;
  bugReportsCount: number;
  lastChecked: string;
  commonIssues: string[];
}

export type UserRole = 'citizen' | 'official';
