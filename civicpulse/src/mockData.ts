import { Post, PortalStatus } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    anonymousHash: 'Anon#9F82',
    state: 'Maharashtra',
    city: 'Pune',
    pincode: '411014',
    category: 'Corruption & Bribery',
    subCategory: 'RTO / Driving License',
    title: 'Inspector demanding ₹3,500 cash for 4-wheeler permanent driving test clearance despite zero errors',
    description: 'At Alandi Road RTO, after completing the track test cleanly without hitting any cones, officer told me to meet the middleman near canteen. They openly claim slot failure unless "file speed charges" of ₹3,500 are handed over. Captured video of agent listing rates outside window.',
    mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    bribeAmount: 3500,
    status: 'Escalated',
    upvotes: 342,
    downvotes: 4,
    commentsCount: 58,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), // 14 days ago (SLA shame clock trigger)
    slaDays: 14,
    pollData: {
      question: 'Are you facing bribe demands at your local RTO too?',
      totalVotes: 890,
      options: [
        { id: 'opt-1', label: 'Yes, demanded ₹2k - ₹5k', votes: 614 },
        { id: 'opt-2', label: 'Had to use an agent/broker', votes: 204 },
        { id: 'opt-3', label: 'Cleared honestly without bribe', votes: 72 }
      ]
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Whistleblower submitted report with video evidence. EXIF metadata stripped.',
        timestamp: '14 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Community Verified',
        description: 'Over 500 citizens corroborating bribe nexus in Pune RTO circle.',
        timestamp: '10 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'SLA Breached & Escalated',
        description: 'No response from Ward/RTO Officer in 7 days. Escalated to State Vigilance.',
        timestamp: '4 days ago',
        status: 'completed'
      },
      {
        id: 'aud-4',
        title: 'Awaiting Official Resolution',
        description: 'Pending enquiry report submission and disciplinary action order.',
        timestamp: 'Present',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'post-2',
    anonymousHash: 'Anon#4A11',
    state: 'Delhi',
    city: 'East Delhi',
    pincode: '110092',
    category: 'Water Problems',
    subCategory: 'Contaminated / Dirty Water',
    title: 'Black sludge & foul-smelling tap water flowing in Laxmi Nagar for 9 continuous days',
    description: 'Delhi Jal Board pipeline has cross-contamination with a broken sewer line near Block D. Residents are getting severe skin allergies and gastro infections. DJB local JE was called 12 times but complaints get marked "resolved" on portal without site visits.',
    mediaUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    status: 'Reported',
    upvotes: 512,
    downvotes: 2,
    commentsCount: 93,
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    slaDays: 9,
    pollData: {
      question: 'Is tap water safe and drinkable in your Delhi locality?',
      totalVotes: 1240,
      options: [
        { id: 'w-1', label: 'Extremely dirty / smells of sewage', votes: 780 },
        { id: 'w-2', label: 'Yellowish / requires RO purifier', votes: 340 },
        { id: 'w-3', label: 'Completely clean and odorless', votes: 120 }
      ]
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Incident posted with water sample images.',
        timestamp: '9 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Community Verified',
        description: '1,000+ local votes confirming widespread contamination.',
        timestamp: '5 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'Forwarded to Executive Engineer',
        description: 'Alert sent to Delhi Jal Board East zonal engineer.',
        timestamp: '2 days ago',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'post-3',
    anonymousHash: 'Anon#7C39',
    state: 'Gujarat',
    city: 'Surat',
    pincode: '395007',
    category: 'Sanitation & Gandgi',
    subCategory: 'Garbage Dump Overflow',
    title: 'Open dumping ground created right opposite Municipal primary school in Vesu',
    description: 'Solid waste collection truck stops at the empty plot opposite school gate and unloads commercial market refuse. Stench is unbearable, stray cattle and dogs have attacked school kids twice this week. Surat Municipal Corporation helpline has not responded.',
    mediaUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    status: 'Resolved',
    upvotes: 680,
    downvotes: 11,
    commentsCount: 42,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    slaDays: 18,
    pollData: {
      question: 'Are waste collection trucks dumping refuse in unauthorized open areas?',
      totalVotes: 510,
      options: [
        { id: 's-1', label: 'Yes, rampant in our ward', votes: 320 },
        { id: 's-2', label: 'Only small road corners', votes: 140 },
        { id: 's-3', label: 'No, clean door-to-door collection', votes: 50 }
      ]
    },
    officialResponse: {
      authorityName: 'Surat Municipal Corporation (SMC)',
      department: 'Health & Solid Waste Management Dept',
      officerRole: 'Zonal Chief Sanitary Inspector',
      statement: 'Plot has been 100% sanitized and cleared using JCB machinery. Boundary fence installed with CCTV monitoring. Contractor issued penalty notice of ₹50,000 for improper route dumping.',
      actionOrderNumber: 'SMC/SWM/2026/8492-B',
      proofUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      respondedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      isVerifiedAction: true
    },
    verification: {
      verifiedVotes: 142,
      disputedVotes: 18,
      totalVotes: 160,
      approvalPercentage: 89,
      isCertified: true,
      isDisputed: false
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Citizens logged school front illegal dump.',
        timestamp: '18 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Notice Served to Zone Inspector',
        description: 'High visibility post escalated to SMC Commissioner.',
        timestamp: '11 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'Site Cleared & Penalties Imposed',
        description: 'JCB team deployed, ₹50k fine levied on contractor.',
        timestamp: '2 days ago',
        status: 'completed'
      },
      {
        id: 'aud-4',
        title: 'Community Verified (88% Positive)',
        description: 'Citizens voted to approve after-photos and clean perimeter.',
        timestamp: '1 day ago',
        status: 'completed'
      }
    ]
  },
  {
    id: 'post-4',
    anonymousHash: 'Anon#1E88',
    state: 'Karnataka',
    city: 'Bengaluru',
    pincode: '560103',
    category: 'Parking & Roads',
    subCategory: 'Illegal Parking Mafia',
    title: 'Private mafia extorting ₹100 "protection fee" on public BBMP road near Bellandur tech park',
    description: 'Goons wearing fake traffic warden jackets carry fabricated receipt booklets and threaten two-wheeler techies parking on the public shoulder. Traffic police outpost is 200m away but refuses to register complaint, alleging jurisdictional ambiguity.',
    mediaUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    bribeAmount: 100,
    status: 'Under Review',
    upvotes: 820,
    downvotes: 5,
    commentsCount: 145,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    slaDays: 5,
    pollData: {
      question: 'Have you paid illegal parking fees on public roads in Bengaluru?',
      totalVotes: 1680,
      options: [
        { id: 'p-1', label: 'Yes, routinely forced to pay', votes: 1290 },
        { id: 'p-2', label: 'Argued and refused', votes: 260 },
        { id: 'p-3', label: 'Never experienced this', votes: 130 }
      ]
    },
    officialResponse: {
      authorityName: 'Bengaluru Traffic Police (BTP)',
      department: 'HSR Layout Traffic Sub-Division',
      officerRole: 'Assistant Commissioner of Police (Traffic)',
      statement: 'Taking cognizance of this report. Special squad assigned to raid Bellandur outer ring road stretch today. Two unauthorized individuals detained for questioning.',
      respondedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      isVerifiedAction: false
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Whistleblower shared photos of fake receipt tokens.',
        timestamp: '5 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Bengaluru Subreddit Amplification',
        description: 'Cross-shared with 1,500+ confirmations.',
        timestamp: '3 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'Police Squad Dispatched',
        description: 'ACP Traffic announced preliminary enquiry.',
        timestamp: 'Yesterday',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'post-5',
    anonymousHash: 'Anon#3B04',
    state: 'Central Portal',
    city: 'National',
    category: 'Gov Website Problem',
    subCategory: 'Agent Nexus / Slot Blocking',
    title: 'Parivahan Sarathi driving test slots vanishing in 4 seconds — Automated bots running by RTO agents',
    description: 'Every morning at 8:00 AM sharp when fresh DL appointment slots open on Sarathi Parivahan, all dates turn red in under 4 seconds. Meanwhile, agents outside the office guarantee confirmed slots if you pay ₹1,200 UPI. Captcha has zero rate-limiting and session tokens are easily exploited by script bots.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    status: 'Escalated',
    upvotes: 1450,
    downvotes: 8,
    commentsCount: 230,
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    slaDays: 21,
    pollData: {
      question: 'Have you been able to book an RTO slot on Parivahan without an agent?',
      totalVotes: 3200,
      options: [
        { id: 'pv-1', label: 'Impossible! Always booked out', votes: 2410 },
        { id: 'pv-2', label: 'Took weeks of daily attempts', votes: 610 },
        { id: 'pv-3', label: 'Easily booked on first try', votes: 180 }
      ]
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Developer submitted network logs showing automated script scraping.',
        timestamp: '21 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Mass Corroboration',
        description: 'Over 2,400 citizens confirmed agent slot hoarding.',
        timestamp: '15 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'Escalated to MoRTH & NIC Tech Cell',
        description: 'National Informatics Centre flagged for Cloudflare bot management upgrade.',
        timestamp: '7 days ago',
        status: 'completed'
      },
      {
        id: 'aud-4',
        title: 'Pending Security Patch Deployment',
        description: 'Awaiting deployment of Aadhaar OTP-verified slot confirmation.',
        timestamp: 'Present',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'post-6',
    anonymousHash: 'Anon#82D5',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    pincode: '226010',
    category: 'Corruption & Bribery',
    subCategory: 'Land & Revenue / Registry',
    title: 'Sub-Registrar office demanding 1% illegal "speed cash" over and above circle stamp duty',
    description: 'During property deed registration in Gomti Nagar, clerk took documents into back cabin and demanded ₹18,000 cash in unsealed envelope before biometric scan. If you refuse, they claim document discrepancy and reject token for 3 months.',
    mediaUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    bribeAmount: 18000,
    status: 'Reported',
    upvotes: 490,
    downvotes: 3,
    commentsCount: 67,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    slaDays: 3,
    pollData: {
      question: 'Were you asked for unregistered cash during property registry in UP?',
      totalVotes: 730,
      options: [
        { id: 'reg-1', label: 'Yes, 1% to 2% demanded', votes: 580 },
        { id: 'reg-2', label: 'Only small peon tip (₹500)', votes: 90 },
        { id: 'reg-3', label: 'Clean process via online slot', votes: 60 }
      ]
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Complaint registered with token and registry receipt details.',
        timestamp: '3 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Ward Notification Sent',
        description: 'Automated alert delivered to District Magistrate grievance cell.',
        timestamp: 'Yesterday',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'post-7',
    anonymousHash: 'Anon#55F0',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400053',
    category: 'Parking & Roads',
    subCategory: 'Severe Potholes',
    title: 'Dangerous 1.5-foot deep pothole crater on Andheri-Kurla Link Road causing multiple bike spills',
    description: 'Right under the metro pier 128, fresh monsoon crater has exposed steel reinforcement. Over 4 delivery riders have fallen in the dark because streetlights are also switched off. BMC contractor used sub-standard cold mix that washed off in 2 hours.',
    mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    status: 'Resolution Disputed',
    upvotes: 940,
    downvotes: 6,
    commentsCount: 112,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    slaDays: 7,
    pollData: {
      question: 'How bad are road potholes in your Mumbai ward right now?',
      totalVotes: 1420,
      options: [
        { id: 'm-1', label: 'Death traps everywhere', votes: 1120 },
        { id: 'm-2', label: 'Patchy but passable', votes: 240 },
        { id: 'm-3', label: 'Smooth concretized roads', votes: 60 }
      ]
    },
    officialResponse: {
      authorityName: 'Brihanmumbai Municipal Corporation (BMC)',
      department: 'Roads & Traffic Department, K-East Ward',
      officerRole: 'Ward Executive Engineer',
      statement: 'Contractor deployed cold-mix asphalt patch over metro pier 128. Claimed site cleared and safe for two-wheeler vehicular traffic.',
      actionOrderNumber: 'BMC/RDS/2026/891-K',
      proofUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      respondedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      isVerifiedAction: false
    },
    verification: {
      verifiedVotes: 12,
      disputedVotes: 48,
      totalVotes: 60,
      approvalPercentage: 20,
      isCertified: false,
      isDisputed: true
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Photo uploaded with coordinates verified before EXIF scrub.',
        timestamp: '7 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'Escalated to BMC Ward Officer',
        description: 'Threshold of 500 upvotes reached within 24 hours.',
        timestamp: '4 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'Official Claimed Resolution',
        description: 'BMC Engineer submitted Order BMC/RDS/2026/891-K claiming cold-mix repair.',
        timestamp: '2 days ago',
        status: 'completed'
      },
      {
        id: 'aud-4',
        title: 'Community Veto (80% Disputed — Failed 60% Rule)',
        description: 'Ground poll rejected proof (20% approval < 60% threshold). Loose gravel washed off. Escalated to Municipal Commissioner.',
        timestamp: 'Yesterday',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'post-8',
    anonymousHash: 'Anon#99B2',
    state: 'Central Portal',
    city: 'National',
    category: 'Gov Website Problem',
    subCategory: 'Payment Deducted & Failed',
    title: 'EPFO Member Portal: Passbook server down continuously for 48 hours, claim submissions failing',
    description: 'Unified Member Portal throws "Server Error 500: An error occurred while processing your request" every time PF transfer or advance withdrawal is submitted. Millions of employees unable to check balance or submit emergency medical advances.',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    exifStripped: true,
    status: 'Escalated',
    upvotes: 1890,
    downvotes: 14,
    commentsCount: 310,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    slaDays: 12,
    pollData: {
      question: 'Is your EPFO portal passbook opening right now?',
      totalVotes: 2850,
      options: [
        { id: 'ep-1', label: 'Down / Gateway timeout error', votes: 2180 },
        { id: 'ep-2', label: 'Extremely slow / Captcha reload error', votes: 530 },
        { id: 'ep-3', label: 'Working normally', votes: 140 }
      ]
    },
    auditTrail: [
      {
        id: 'aud-1',
        title: 'Reported Anonymously',
        description: 'Initial bug report with HTTP 500 error logs.',
        timestamp: '12 days ago',
        status: 'completed'
      },
      {
        id: 'aud-2',
        title: 'EPFO Tagged on Twitter/X',
        description: 'Over 2,000 citizens corroborated nationwide outage.',
        timestamp: '8 days ago',
        status: 'completed'
      },
      {
        id: 'aud-3',
        title: 'Escalated to Ministry of Labour',
        description: 'Parliamentary grievance cell notified of server outage.',
        timestamp: '3 days ago',
        status: 'in_progress'
      }
    ]
  }
];

export const INITIAL_PORTALS: PortalStatus[] = [
  {
    id: 'port-1',
    portalName: 'Parivahan Sarathi (DL & Vehicle RTO)',
    category: 'Central',
    url: 'https://sarathi.parivahan.gov.in',
    status: 'Degraded',
    bugReportsCount: 428,
    lastChecked: '3 mins ago',
    commonIssues: ['Agent Bot Slot Hoarding', 'DL Test Slot Freeze', 'Payment Gateway Timeout', 'State Code Discrepancy']
  },
  {
    id: 'port-2',
    portalName: 'EPFO Unified Member Portal',
    category: 'Central',
    url: 'https://unifiedportal-mem.epfindia.gov.in',
    status: 'Down',
    bugReportsCount: 1240,
    lastChecked: 'Just now',
    commonIssues: ['Passbook HTTP 500', 'Aadhaar OTP Not Arriving', 'Claim Form 31 Blank Error', 'Session Expired Loop']
  },
  {
    id: 'port-3',
    portalName: 'Passport Seva Online',
    category: 'Central',
    url: 'https://passportindia.gov.in',
    status: 'Operational',
    bugReportsCount: 38,
    lastChecked: '8 mins ago',
    commonIssues: ['Tatkaal Slot Exhaustion in 10s', 'Fee Receipt Download PDF Corrupt']
  },
  {
    id: 'port-4',
    portalName: 'Income Tax e-Filing 2.0',
    category: 'Central',
    url: 'https://www.incometax.gov.in',
    status: 'Operational',
    bugReportsCount: 84,
    lastChecked: '12 mins ago',
    commonIssues: ['AIS/TIS Data Mismatch', 'Challan 280 Payment Status Delay']
  },
  {
    id: 'port-5',
    portalName: 'UIDAI Aadhaar Self-Service Portal (myAadhaar)',
    category: 'Central',
    url: 'https://myaadhaar.uidai.gov.in',
    status: 'Degraded',
    bugReportsCount: 312,
    lastChecked: '5 mins ago',
    commonIssues: ['Biometric Lock Toggle Delayed', 'Document Update PDF Upload Limit Bug', 'OTP SMS Delay']
  },
  {
    id: 'port-6',
    portalName: 'MahaBhumi (Maharashtra Land Records / 7/12)',
    category: 'State',
    url: 'https://bhulekh.mahabhumi.gov.in',
    status: 'Operational',
    bugReportsCount: 96,
    lastChecked: '15 mins ago',
    commonIssues: ['Digital 7/12 Signature Verification Error', 'Server Slow During Peak Revenue Hours']
  },
  {
    id: 'port-7',
    portalName: 'UP Bhulekh / Stamp & Registry',
    category: 'State',
    url: 'https://upbhulekh.gov.in',
    status: 'Degraded',
    bugReportsCount: 184,
    lastChecked: '2 mins ago',
    commonIssues: ['Gata / Khasra Map Viewer Broken', 'Khatauni Verification Gateway Error']
  },
  {
    id: 'port-8',
    portalName: 'BMC / MCGM Citizen Portal (Mumbai)',
    category: 'State',
    url: 'https://portal.mcgm.gov.in',
    status: 'Operational',
    bugReportsCount: 52,
    lastChecked: '20 mins ago',
    commonIssues: ['Property Tax Assessment Payment Gateway Double Deduction', 'Water Bill Duplicate Slip']
  }
];

export const STATES_LIST = [
  { name: 'Maharashtra', code: 'MH', count: 184 },
  { name: 'Delhi', code: 'DL', count: 142 },
  { name: 'Gujarat', code: 'GJ', count: 98 },
  { name: 'Karnataka', code: 'KA', count: 115 },
  { name: 'Uttar Pradesh', code: 'UP', count: 167 },
  { name: 'Bihar', code: 'BR', count: 74 },
  { name: 'Tamil Nadu', code: 'TN', count: 62 },
  { name: 'Rajasthan', code: 'RJ', count: 58 }
];

export const CATEGORIES_LIST = [
  { name: 'All Categories', icon: 'Flame' },
  { name: 'Corruption & Bribery', icon: 'ShieldAlert' },
  { name: 'Water Problems', icon: 'Droplets' },
  { name: 'Sanitation & Gandgi', icon: 'Trash2' },
  { name: 'Parking & Roads', icon: 'Car' },
  { name: 'Gov Website Problem', icon: 'Globe' }
];
