import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, PortalStatus, UserRole, Comment } from '../types';
import { INITIAL_POSTS, INITIAL_PORTALS } from '../mockData';

interface CivicContextType {
  posts: Post[];
  portals: PortalStatus[];
  comments: Record<string, Comment[]>;
  role: UserRole;
  selectedState: string;
  selectedCategory: string;
  searchQuery: string;
  feedFilter: string;
  setRole: (role: UserRole) => void;
  setSelectedState: (state: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setFeedFilter: (filter: string) => void;
  addPost: (newPost: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentsCount' | 'slaDays' | 'auditTrail'>) => Post;
  votePost: (postId: string, direction: 'up' | 'down') => void;
  votePoll: (postId: string, optionId: string) => void;
  votePortalIssue: (portalId: string) => void;
  addPortalBug: (portalName: string, category: 'Central' | 'State', issue: string) => void;
  addOfficialAction: (
    postId: string,
    action: {
      status: Post['status'];
      authorityName: string;
      department: string;
      officerRole: string;
      statement: string;
      actionOrderNumber?: string;
      proofUrl?: string;
    }
  ) => void;
  voteResolutionVerification: (postId: string, vote: 'verify' | 'dispute') => void;
  addComment: (postId: string, text: string) => void;
  voteComment: (postId: string, commentId: string) => void;
  resetToDefault: () => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

const POSTS_STORAGE_KEY = 'civicpulse_posts_v1';
const PORTALS_STORAGE_KEY = 'civicpulse_portals_v1';
const COMMENTS_STORAGE_KEY = 'civicpulse_comments_v1';
const ROLE_STORAGE_KEY = 'civicpulse_role_v1';

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(POSTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved posts', e);
      }
    }
    return INITIAL_POSTS;
  });

  const [portals, setPortals] = useState<PortalStatus[]>(() => {
    const saved = localStorage.getItem(PORTALS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved portals', e);
      }
    }
    return INITIAL_PORTALS;
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved comments', e);
      }
    }
    return {
      'post-1': [
        {
          id: 'c-1',
          postId: 'post-1',
          anonymousHash: 'Anon#4471',
          content: 'Happened to my brother in Alandi road RTO last month as well. The touts outside have direct WhatsApp groups with the clerks.',
          createdAt: '12 days ago',
          upvotes: 45
        },
        {
          id: 'c-2',
          postId: 'post-1',
          anonymousHash: 'Anon#9901',
          content: 'Keep filing complaints on Aaple Sarkar portal too. Tag the Pune CP on X/Twitter.',
          createdAt: '8 days ago',
          upvotes: 19
        }
      ],
      'post-2': [
        {
          id: 'c-3',
          postId: 'post-2',
          anonymousHash: 'Anon#8821',
          content: 'East Delhi resident here. TDS meter showed 1450 ppm this morning. Normal drinking water is under 200 ppm!',
          createdAt: '7 days ago',
          upvotes: 38
        }
      ]
    };
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(ROLE_STORAGE_KEY) as UserRole) || 'citizen';
  });

  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedFilter, setFeedFilter] = useState<string>('hot');

  useEffect(() => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(PORTALS_STORAGE_KEY, JSON.stringify(portals));
  }, [portals]);

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };

  const addPost = (
    newPostData: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentsCount' | 'slaDays' | 'auditTrail'>
  ): Post => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      commentsCount: 0,
      slaDays: 0,
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          title: 'Reported Anonymously',
          description: 'Citizen report lodged. Cryptographic hash assigned and EXIF metadata scrubbed.',
          timestamp: 'Just now',
          status: 'completed'
        },
        {
          id: `aud-${Date.now()}-2`,
          title: 'Community Verification (Poll Active)',
          description: 'Awaiting local citizens to verify impact via live card poll.',
          timestamp: 'In progress',
          status: 'in_progress'
        },
        {
          id: `aud-${Date.now()}-3`,
          title: 'SLA Escalation Timer Active',
          description: 'Notice served to respective ward/department.',
          timestamp: 'Pending',
          status: 'pending'
        }
      ]
    };

    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const votePost = (postId: string, direction: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;

        let newUpvotes = p.upvotes;
        let newDownvotes = p.downvotes;
        let newUserVote: 'up' | 'down' | undefined = direction;

        if (p.userVote === direction) {
          // Toggle off
          newUserVote = undefined;
          if (direction === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (direction === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
        } else if (p.userVote) {
          // Switch vote
          if (direction === 'up') {
            newUpvotes += 1;
            newDownvotes = Math.max(0, newDownvotes - 1);
          } else {
            newDownvotes += 1;
            newUpvotes = Math.max(0, newUpvotes - 1);
          }
        } else {
          // New vote
          if (direction === 'up') newUpvotes += 1;
          if (direction === 'down') newDownvotes += 1;
        }

        return {
          ...p,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        };
      })
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        if (p.pollData.userVotedOptionId) return p; // already voted

        const updatedOptions = p.pollData.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        return {
          ...p,
          pollData: {
            ...p.pollData,
            totalVotes: p.pollData.totalVotes + 1,
            userVotedOptionId: optionId,
            options: updatedOptions
          }
        };
      })
    );
  };

  const votePortalIssue = (portalId: string) => {
    setPortals(prev =>
      prev.map(port => {
        if (port.id !== portalId) return port;
        return {
          ...port,
          bugReportsCount: port.bugReportsCount + 1,
          lastChecked: 'Just now'
        };
      })
    );
  };

  const addPortalBug = (portalName: string, category: 'Central' | 'State', issue: string) => {
    setPortals(prev => {
      const existing = prev.find(p => p.portalName.toLowerCase() === portalName.toLowerCase());
      if (existing) {
        return prev.map(p => {
          if (p.id !== existing.id) return p;
          return {
            ...p,
            bugReportsCount: p.bugReportsCount + 1,
            status: p.status === 'Operational' ? 'Degraded' : p.status,
            commonIssues: Array.from(new Set([issue, ...p.commonIssues]))
          };
        });
      }

      const newPortal: PortalStatus = {
        id: `port-${Date.now()}`,
        portalName,
        category,
        url: `https://${portalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.gov.in`,
        status: 'Degraded',
        bugReportsCount: 1,
        lastChecked: 'Just now',
        commonIssues: [issue]
      };
      return [newPortal, ...prev];
    });
  };

  const addOfficialAction = (
    postId: string,
    action: {
      status: Post['status'];
      authorityName: string;
      department: string;
      officerRole: string;
      statement: string;
      actionOrderNumber?: string;
      proofUrl?: string;
    }
  ) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;

        const isResolution = action.status === 'Resolved';
        const finalStatus = isResolution ? 'Pending Verification' : action.status;

        const updatedAudit = [
          ...p.auditTrail,
          {
            id: `aud-${Date.now()}`,
            title: isResolution ? 'Official Action: Resolution Claimed (Proof Attached)' : `Official Action: ${action.status}`,
            description: `${action.authorityName} (${action.department}) submitted statement & Order #${action.actionOrderNumber || 'N/A'}.${isResolution ? ' Awaiting community 60% ground verification approval.' : ''}`,
            timestamp: 'Just now',
            status: 'completed' as const
          }
        ];

        return {
          ...p,
          status: finalStatus,
          officialResponse: {
            authorityName: action.authorityName,
            department: action.department,
            officerRole: action.officerRole,
            statement: action.statement,
            actionOrderNumber: action.actionOrderNumber,
            proofUrl: action.proofUrl,
            respondedAt: new Date().toISOString(),
            isVerifiedAction: false
          },
          verification: isResolution ? {
            verifiedVotes: 1,
            disputedVotes: 0,
            totalVotes: 1,
            approvalPercentage: 100,
            isCertified: false,
            isDisputed: false
          } : p.verification,
          auditTrail: updatedAudit
        };
      })
    );
  };

  const voteResolutionVerification = (postId: string, vote: 'verify' | 'dispute') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;

        const current = p.verification || {
          verifiedVotes: p.status === 'Resolved' ? 2 : 1,
          disputedVotes: p.status === 'Resolution Disputed' ? 2 : 0,
          totalVotes: (p.status === 'Resolved' || p.status === 'Resolution Disputed') ? 2 : 1,
          approvalPercentage: p.status === 'Resolved' ? 100 : 33,
          isCertified: p.status === 'Resolved',
          isDisputed: p.status === 'Resolution Disputed'
        };

        if (current.userVote) return p; // already voted

        const newVerified = vote === 'verify' ? current.verifiedVotes + 1 : current.verifiedVotes;
        const newDisputed = vote === 'dispute' ? current.disputedVotes + 1 : current.disputedVotes;
        const newTotal = newVerified + newDisputed;
        const newApproval = Math.round((newVerified / newTotal) * 100);

        const isCertified = newApproval >= 60 && newTotal >= 3;
        const isDisputed = newApproval < 60 && newTotal >= 3;

        let newStatus: Post['status'] = p.status;
        const newAudit = [...p.auditTrail];

        if (isCertified && p.status !== 'Resolved') {
          newStatus = 'Resolved';
          newAudit.push({
            id: `aud-${Date.now()}`,
            title: 'Community Consensus: 60%+ Approval Certified',
            description: `Citizen ground verification reached ${newApproval}% positive approval (>= 60% threshold). Issue marked officially Resolved.`,
            timestamp: 'Just now',
            status: 'completed'
          });
        } else if (isDisputed && p.status !== 'Resolution Disputed') {
          newStatus = 'Resolution Disputed';
          newAudit.push({
            id: `aud-${Date.now()}`,
            title: 'Community Veto: Failed 60% Verification Rule',
            description: `Citizen approval fell to ${newApproval}% (< 60% required). Ground work declared fake/incomplete. Re-escalated to Zonal Commissioner.`,
            timestamp: 'Just now',
            status: 'in_progress'
          });
        }

        return {
          ...p,
          status: newStatus,
          verification: {
            verifiedVotes: newVerified,
            disputedVotes: newDisputed,
            totalVotes: newTotal,
            userVote: vote,
            approvalPercentage: newApproval,
            isCertified,
            isDisputed
          },
          officialResponse: p.officialResponse ? {
            ...p.officialResponse,
            isVerifiedAction: isCertified
          } : undefined,
          auditTrail: newAudit
        };
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      anonymousHash: `Anon#${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      content: text,
      createdAt: 'Just now',
      upvotes: 1
    };

    setComments(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
  };

  const voteComment = (postId: string, commentId: string) => {
    setComments(prev => {
      const postComments = prev[postId] || [];
      const updated = postComments.map(c => 
        c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
      );
      return {
        ...prev,
        [postId]: updated
      };
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem(POSTS_STORAGE_KEY);
    localStorage.removeItem(PORTALS_STORAGE_KEY);
    localStorage.removeItem(COMMENTS_STORAGE_KEY);
    setPosts(INITIAL_POSTS);
    setPortals(INITIAL_PORTALS);
  };

  return (
    <CivicContext.Provider
      value={{
        posts,
        portals,
        comments,
        role,
        selectedState,
        selectedCategory,
        searchQuery,
        feedFilter,
        setRole,
        setSelectedState,
        setSelectedCategory,
        setSearchQuery,
        setFeedFilter,
        addPost,
        votePost,
        votePoll,
        votePortalIssue,
        addPortalBug,
        addOfficialAction,
        voteResolutionVerification,
        addComment,
        voteComment,
        resetToDefault
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
