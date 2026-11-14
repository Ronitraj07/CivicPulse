import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  IndianRupee, 
  MapPin, 
  RefreshCw, 
  HelpCircle, 
  FileText, 
  Plus, 
  Trash2, 
  Lock, 
  Check, 
  Copy,
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PostCategory } from '../types';

// Category to Sub-Category Mapping
const CATEGORY_MAP: Record<PostCategory, string[]> = {
  'Corruption & Bribery': [
    'Police / Traffic Challan',
    'RTO / License',
    'Municipal / BMC Tender & Permits',
    'Land & Revenue / Registry',
    'Ration / PDS Scam'
  ],
  'Water Problems': [
    'No Water Supply',
    'Contaminated / Dirty Water',
    'Pipeline Leakage',
    'Tanker Mafia'
  ],
  'Sanitation & Gandgi': [
    'Garbage Dump Overflow',
    'Open Drain / Sewage Overflow',
    'Street Sweeping Absent',
    'Public Toilet Locked / Broken'
  ],
  'Parking & Roads': [
    'Illegal Parking Mafia',
    'Severe Potholes',
    'Encroachment',
    'Broken Streetlights'
  ],
  'Gov Website Problem': [
    'Server Down / Crash',
    'Payment Deducted & Failed',
    'OTP Not Coming',
    'Agent Nexus / Slot Blocking'
  ]
};

const ALL_INDIAN_STATES = [
  'Maharashtra',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Uttar Pradesh',
  'Bihar',
  'Tamil Nadu',
  'Rajasthan',
  'West Bengal',
  'Telangana',
  'Kerala',
  'Punjab',
  'Madhya Pradesh',
  'Haryana',
  'Andhra Pradesh',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Goa',
  'Himachal Pradesh'
];

export const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useCivic();

  // Cryptographic Anonymous Identifier
  const generateAnonymousId = () => {
    const chars = '0123456789ABCDEF';
    let hash = '';
    for (let i = 0; i < 4; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return `Whistleblower_#${hash}X`;
  };

  const [anonymousId, setAnonymousId] = useState(generateAnonymousId());

  // Form State
  const [stateName, setStateName] = useState('Maharashtra');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [category, setCategory] = useState<PostCategory>('Corruption & Bribery');
  const [subCategory, setSubCategory] = useState(CATEGORY_MAP['Corruption & Bribery'][0]);
  const [bribeAmount, setBribeAmount] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Evidence & Simulated EXIF Stripper State
  const [mediaUrl, setMediaUrl] = useState('');
  const [isStripping, setIsStripping] = useState(false);
  const [strippingProgress, setStrippingProgress] = useState(0);
  const [strippingStatusText, setStrippingStatusText] = useState('');
  const [exifScrubbed, setExifScrubbed] = useState(false);

  // Poll Builder State
  const [pollQuestion, setPollQuestion] = useState('How severe is this issue in your area/ward?');
  const [pollOptions, setPollOptions] = useState([
    'Yes, Facing this Daily / Rampant',
    'Occasional Issue in my locality',
    'No, Resolved / Honest in my ward'
  ]);

  // Submission / Success Tracking Modal State
  const [submittedPostId, setSubmittedPostId] = useState<string | null>(null);
  const [secretTrackingKey, setSecretTrackingKey] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Auto update subcategories when category changes
  const handleCategoryChange = (newCategory: PostCategory) => {
    setCategory(newCategory);
    setSubCategory(CATEGORY_MAP[newCategory][0]);
    if (newCategory !== 'Corruption & Bribery') {
      setBribeAmount('');
    }
  };

  // Poll option handlers
  const handleOptionChange = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleAddOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // Simulated EXIF & GPS Stripper Engine
  const triggerExifScrubber = (sampleImgUrl?: string) => {
    setIsStripping(true);
    setExifScrubbed(false);
    setStrippingProgress(10);
    setStrippingStatusText('Scanning file header for Exchangeable Image File (EXIF) tags...');

    setTimeout(() => {
      setStrippingProgress(40);
      setStrippingStatusText('Scrubbing GPS Coordinates (Latitude, Longitude, Altitude)...');
    }, 450);

    setTimeout(() => {
      setStrippingProgress(75);
      setStrippingStatusText('Purging Camera Hardware ID, Phone Serial, and Timestamp...');
    }, 900);

    setTimeout(() => {
      setStrippingProgress(100);
      setStrippingStatusText('✓ Whistleblower Security Seal Applied: 100% Sanitized.');
      setIsStripping(false);
      setExifScrubbed(true);
      setMediaUrl(
        sampleImgUrl || 
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
      );
    }, 1350);
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create local object URL for preview
      const localUrl = URL.createObjectURL(e.target.files[0]);
      triggerExifScrubber(localUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim() || !title.trim() || !description.trim()) {
      alert('Please fill in the city, incident headline, and detailed description.');
      return;
    }

    const trackingKey = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPost = addPost({
      anonymousHash: anonymousId,
      state: stateName,
      city: city.trim(),
      pincode: pincode.trim() || undefined,
      category,
      subCategory,
      title: title.trim(),
      description: description.trim(),
      mediaUrl: mediaUrl || undefined,
      exifStripped: true,
      bribeAmount: bribeAmount ? Number(bribeAmount) : undefined,
      status: 'Reported',
      pollData: {
        question: pollQuestion.trim() || `Facing this in your ward too?`,
        totalVotes: 1,
        options: pollOptions.map((opt, idx) => ({
          id: `opt-${idx + 1}`,
          label: opt.trim() || `Option ${idx + 1}`,
          votes: idx === 0 ? 1 : 0
        }))
      }
    });

    setSubmittedPostId(newPost.id);
    setSecretTrackingKey(trackingKey);
  };

  const copyTrackingKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretTrackingKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Identity Shield Banner */}
      <div className="bg-[#12141D] rounded-2xl border border-emerald-500/30 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Whistleblower Identity Shield Active</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Zero Logs
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Your IP address, browser cookies, and hardware identifiers are scrubbed. You are posting as:
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {anonymousId}
                </span>
                <button
                  type="button"
                  onClick={() => setAnonymousId(generateAnonymousId())}
                  className="text-[11px] text-[#9CA3AF] hover:text-white flex items-center gap-1 transition-colors"
                  title="Generate a new random anonymous pseudonym"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate Pseudonym
                </button>
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#9CA3AF] hidden lg:block shrink-0 border-l border-[#1F2430] pl-4">
            <span className="text-gray-200 font-semibold block">Protected by Law</span>
            <span>Whistle Blowers Protection Act compliant architecture</span>
          </div>
        </div>
      </div>

      {/* 2. Main Multi-Section Form */}
      <form onSubmit={handleSubmit} className="bg-[#12141D] rounded-2xl border border-[#1F2430] p-6 space-y-6 shadow-xl">
        
        {/* Section Header */}
        <div className="border-b border-[#1F2430] pb-4">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF4500]" />
            Anonymous Complaint & Grievance Studio
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Provide details of the civic apathy, bribery extortion, or public portal bug. All data is verified by community voting.
          </p>
        </div>

        {/* Location Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#FF4500]" />
            <span>1. Incident Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">State *</label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FF4500] transition-colors"
              >
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">City / District *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune, Surat, East Delhi, Lucknow"
                required
                className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF4500] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Ward / Pincode (Optional)</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. Ward 14, 411014"
                className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF4500] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Category & Sub-Category Selector */}
        <div className="space-y-3 pt-2 border-t border-[#1F2430]/60">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#FF4500]" />
            <span>2. Dynamic Category Classification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Primary Category *</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as PostCategory)}
                className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FF4500] transition-colors font-medium"
              >
                <option value="Corruption & Bribery">Corruption & Bribery</option>
                <option value="Water Problems">Water Problems</option>
                <option value="Sanitation & Gandgi">Sanitation & Gandgi</option>
                <option value="Parking & Roads">Parking & Roads</option>
                <option value="Gov Website Problem">Gov Website Problem</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Sub-Category *</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FF4500] transition-colors"
              >
                {CATEGORY_MAP[category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Bribe Amount Demanded field */}
          {category === 'Corruption & Bribery' && (
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 animate-fadeIn">
              <label className="block text-xs font-bold text-red-300 mb-1 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-red-400" />
                Bribe Amount Demanded (Optional ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={bribeAmount}
                  onChange={(e) => setBribeAmount(e.target.value)}
                  placeholder="e.g. 3500 (Leave blank if extortion amount was unspecified)"
                  className="w-full pl-7 pr-3 py-2 bg-[#12141D] border border-red-500/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <p className="text-[10px] text-red-300/70 mt-1">
                Will be indexed in the public Corruption Ledger to track department-wise bribe totals.
              </p>
            </div>
          )}
        </div>

        {/* Incident Narrative */}
        <div className="space-y-3 pt-2 border-t border-[#1F2430]/60">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#FF4500]" />
            <span>3. Incident Details & Narrative</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Headline / Title * <span className="text-[#9CA3AF] font-normal">({title.length}/120)</span>
            </label>
            <input
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inspector demanding ₹3,500 cash for 4-wheeler permanent driving test clearance"
              required
              className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF4500] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Full Incident Narrative & Evidence Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what occurred, dates, time, department desk involved, tout nexus, or specific error message..."
              required
              className="w-full bg-[#181C28] border border-[#1F2430] rounded-xl p-3 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF4500] transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* 4. Simulated Evidence Uploader & Auto-EXIF Stripper */}
        <div className="space-y-3 pt-2 border-t border-[#1F2430]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
              <Upload className="w-3.5 h-3.5 text-[#FF4500]" />
              <span>4. Evidence Upload & Auto-EXIF Stripper</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> GPS Scrubbing Mandatory
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#181C28] border border-[#1F2430] space-y-3">
            
            {/* Upload or Demo Trigger Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#12141D] hover:bg-[#161922] text-gray-200 text-xs font-semibold border border-[#1F2430] hover:border-gray-500 transition-all">
                <Upload className="w-4 h-4 text-[#FF4500]" />
                <span>Upload Photo / Document</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadSim}
                  disabled={isStripping}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => triggerExifScrubber()}
                disabled={isStripping}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F2430] hover:bg-[#2A3040] text-gray-300 text-xs font-semibold transition-colors"
              >
                <span>Or Attach Sample Evidence & Scrub</span>
              </button>
            </div>

            {/* Stripping Progress Bar & Animation */}
            {isStripping && (
              <div className="p-3 rounded-lg bg-[#12141D] border border-blue-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                    {strippingStatusText}
                  </span>
                  <span className="font-mono font-bold text-blue-300">{strippingProgress}%</span>
                </div>
                <div className="w-full bg-[#1F2430] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${strippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Scrubbed Evidence Preview */}
            {exifScrubbed && mediaUrl && (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/40 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    EXIF Metadata Successfully Stripped!
                  </span>
                  <span className="text-[10px] text-emerald-300/80">
                    GPS Coordinates Cleared • Device ID Cleared
                  </span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-[#1F2430] max-h-48 bg-black">
                  <img
                    src={mediaUrl}
                    alt="Sanitized evidence preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Protected Whistleblower Image Seal
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 5. Custom Poll Builder ("Me Too / Impact Poll") */}
        <div className="space-y-3 pt-2 border-t border-[#1F2430]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF4500]" />
              <span>5. "Me Too / Affected" Community Poll Builder</span>
            </div>
            <span className="text-[11px] text-[#9CA3AF]">
              Drives post to Top Feed when citizens vote
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#181C28] border border-[#1F2430] space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Poll Question (Pre-filled or Customize)
              </label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. How severe is this in your area?"
                className="w-full bg-[#12141D] border border-[#1F2430] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FF4500]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-300">
                Poll Options (Minimum 2, Maximum 5)
              </label>
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#9CA3AF] w-5 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 bg-[#12141D] border border-[#1F2430] rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#FF4500]"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-1 flex items-center gap-1.5 text-xs text-[#FF4500] hover:underline font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Option
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 6. Submit Button */}
        <div className="pt-4 border-t border-[#1F2430]">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4500] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm shadow-xl shadow-[#FF4500]/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005] active:scale-[0.995]"
          >
            <Lock className="w-4 h-4" />
            <span>Publish Anonymous Report to Public Feed</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <p className="text-[11px] text-center text-[#9CA3AF] mt-2">
            By publishing, your incident will be visible on the public feed and forwarded to respective municipal and state vigilance dashboards.
          </p>
        </div>

      </form>

      {/* 3. Success Modal with Secret Tracking Key Receipt */}
      {submittedPostId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12141D] rounded-3xl border border-emerald-500/40 max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Incident Successfully Published!</h3>
              <p className="text-xs text-gray-300 mt-1">
                Your report has been prepended to the public feed and forwarded to the local authority triage queue.
              </p>
            </div>

            {/* Secret Tracking Key Box */}
            <div className="p-4 rounded-2xl bg-[#181C28] border border-[#1F2430] text-left space-y-2">
              <span className="text-[11px] text-[#9CA3AF] font-medium block">
                Your Secret Anonymous Tracking Key:
              </span>
              <div className="flex items-center justify-between bg-[#12141D] px-3 py-2 rounded-xl border border-[#1F2430]">
                <span className="font-mono font-bold text-sm text-[#FF4500]">
                  {secretTrackingKey}
                </span>
                <button
                  onClick={copyTrackingKey}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded bg-[#181C28]"
                  title="Copy secret tracking key"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Save this key. You can use it to track department enquiry orders and audit updates anonymously.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 rounded-xl bg-[#181C28] hover:bg-[#1F2430] text-gray-200 text-xs font-semibold border border-[#1F2430] transition-colors"
              >
                Go to Main Feed
              </button>
              <button
                onClick={() => navigate(`/post/${submittedPostId}`)}
                className="flex-1 py-3 rounded-xl bg-[#FF4500] hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-[#FF4500]/25 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Incident</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
