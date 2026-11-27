import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { PostCategory } from '../types';
import { Button, cn } from '../components/ui';

const CATEGORY_MAP: Record<PostCategory, string[]> = {
  'Corruption & Bribery': ['Police / Traffic Challan', 'RTO / License', 'Municipal / BMC Tender & Permits', 'Land & Revenue / Registry', 'Ration / PDS Scam'],
  'Water Problems': ['No Water Supply', 'Contaminated / Dirty Water', 'Pipeline Leakage', 'Tanker Mafia'],
  'Sanitation & Gandgi': ['Garbage Dump Overflow', 'Open Drain / Sewage Overflow', 'Street Sweeping Absent', 'Public Toilet Locked / Broken'],
  'Parking & Roads': ['Illegal Parking Mafia', 'Severe Potholes', 'Encroachment', 'Broken Streetlights'],
  'Gov Website Problem': ['Server Down / Crash', 'Payment Deducted & Failed', 'OTP Not Coming', 'Agent Nexus / Slot Blocking'],
};

const STATES = [
  'Maharashtra', 'Delhi', 'Gujarat', 'Karnataka', 'Uttar Pradesh', 'Bihar', 'Tamil Nadu', 'Rajasthan', 'West Bengal', 'Telangana', 'Kerala',
  'Punjab', 'Madhya Pradesh', 'Haryana', 'Andhra Pradesh', 'Odisha', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand', 'Goa', 'Himachal Pradesh',
];

const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-accent';
const field = `w-full rounded-md border border-civic-border bg-civic-surface px-3 py-2.5 text-sm text-civic-text placeholder:text-civic-muted/70 focus:border-civic-accent ${ring}`;
const labelCls = 'mb-1.5 block text-sm font-medium text-civic-text';
const MAX_EDGE = 1600;
const MAX_BYTES = 15 * 1024 * 1024;

const makePseudonym = () => {
  const chars = '0123456789ABCDEF';
  let hash = '';
  for (let i = 0; i < 4; i++) hash += chars[Math.floor(Math.random() * chars.length)];
  return `Whistleblower_#${hash}X`;
};

const formatKb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Re-encodes the image through a canvas. The output carries no EXIF, GPS or camera data.
async function stripMetadata(file: File): Promise<{ url: string; before: number; after: number }> {
  const srcUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode'));
      el.src = srcUrl;
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    if (!blob) throw new Error('encode');
    return { url: URL.createObjectURL(blob), before: file.size, after: blob.size };
  } finally {
    URL.revokeObjectURL(srcUrl);
  }
}

const Section: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <fieldset className="border-t border-civic-border pt-6">
    <legend className="font-display text-xl font-semibold text-civic-text">
      <span className="mr-2 font-mono text-sm font-normal text-civic-muted">{n}.</span>
      {title}
    </legend>
    <div className="mt-4 space-y-4">{children}</div>
  </fieldset>
);

export const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useCivic();

  const [anonymousId, setAnonymousId] = useState(makePseudonym);
  const [stateName, setStateName] = useState('Maharashtra');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [category, setCategory] = useState<PostCategory>('Corruption & Bribery');
  const [subCategory, setSubCategory] = useState(CATEGORY_MAP['Corruption & Bribery'][0]);
  const [bribeAmount, setBribeAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaState, setMediaState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [mediaNote, setMediaNote] = useState('');

  const [pollQuestion, setPollQuestion] = useState('How severe is this issue in your area?');
  const [pollOptions, setPollOptions] = useState(['Yes, it happens daily', 'It happens occasionally', 'No, it works fine in my ward']);

  const [formError, setFormError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [trackingKey, setTrackingKey] = useState('');
  const [copied, setCopied] = useState(false);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submittedId) successHeading.current?.focus();
  }, [submittedId]);

  const changeCategory = (next: PostCategory) => {
    setCategory(next);
    setSubCategory(CATEGORY_MAP[next][0]);
    if (next !== 'Corruption & Bribery') setBribeAmount('');
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMediaState('error');
      setMediaNote('Please choose an image file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setMediaState('error');
      setMediaNote('That image is over 15 MB. Choose a smaller one.');
      return;
    }
    setMediaState('working');
    setMediaNote('');
    try {
      const result = await stripMetadata(file);
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      setMediaUrl(result.url);
      setMediaState('done');
      setMediaNote(`Re-encoded in your browser: ${formatKb(result.before)} to ${formatKb(result.after)}. Location, camera and timestamp data were not carried over.`);
    } catch {
      setMediaState('error');
      setMediaNote('This image could not be processed. Try a JPEG or PNG.');
    }
  };

  const removeMedia = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl('');
    setMediaState('idle');
    setMediaNote('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !title.trim() || !description.trim()) {
      setFormError('Add the city, a headline and a description before publishing.');
      return;
    }
    setFormError('');
    const post = addPost({
      anonymousHash: anonymousId,
      state: stateName,
      city: city.trim(),
      pincode: pincode.trim() || undefined,
      category,
      subCategory,
      title: title.trim(),
      description: description.trim(),
      mediaUrl: mediaUrl || undefined,
      exifStripped: Boolean(mediaUrl),
      bribeAmount: bribeAmount ? Number(bribeAmount) : undefined,
      status: 'Reported',
      pollData: {
        question: pollQuestion.trim() || 'Are you facing this in your ward too?',
        totalVotes: 1,
        options: pollOptions.map((opt, idx) => ({ id: `opt-${idx + 1}`, label: opt.trim() || `Option ${idx + 1}`, votes: idx === 0 ? 1 : 0 })),
      },
    });
    setTrackingKey(`TRK-${Math.floor(100000 + Math.random() * 900000)}`);
    setSubmittedId(post.id);
  };

  const copyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-civic-text">File a report</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-civic-muted">
        Describe what happened, where, and what you can show. Other residents can back your report and say whether they face the same problem.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-civic-border py-4">
        <div>
          <p className="text-xs text-civic-muted">You will appear as</p>
          <p className="mt-0.5 font-mono text-sm text-civic-text">{anonymousId}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setAnonymousId(makePseudonym())}>New pseudonym</Button>
        <p className="w-full text-xs leading-relaxed text-civic-muted">
          No account or name is needed. This is a demonstration: nothing is sent to a server or to any authority.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <Section n={1} title="Where it happened">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="f-state" className={labelCls}>State</label>
              <select id="f-state" value={stateName} onChange={(e) => setStateName(e.target.value)} className={field}>
                {STATES.map((st) => (<option key={st} value={st}>{st}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="f-city" className={labelCls}>City or district</label>
              <input id="f-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Pune" required className={field} />
            </div>
            <div>
              <label htmlFor="f-pin" className={labelCls}>Ward or pincode <span className="font-normal text-civic-muted">(optional)</span></label>
              <input id="f-pin" type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="411014" className={field} />
            </div>
          </div>
        </Section>

        <Section n={2} title="What kind of problem">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-cat" className={labelCls}>Topic</label>
              <select id="f-cat" value={category} onChange={(e) => changeCategory(e.target.value as PostCategory)} className={field}>
                {(Object.keys(CATEGORY_MAP) as PostCategory[]).map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="f-sub" className={labelCls}>Type</label>
              <select id="f-sub" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className={field}>
                {CATEGORY_MAP[category].map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
              </select>
            </div>
          </div>

          {category === 'Corruption & Bribery' && (
            <div className="border-l-2 border-civic-red pl-4">
              <label htmlFor="f-bribe" className={labelCls}>Amount demanded in rupees <span className="font-normal text-civic-muted">(optional)</span></label>
              <div className="relative max-w-xs">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-civic-muted" aria-hidden="true">₹</span>
                <input id="f-bribe" type="number" inputMode="numeric" min={0} value={bribeAmount} onChange={(e) => setBribeAmount(e.target.value)} placeholder="3500" className={cn(field, 'pl-7 font-mono')} />
              </div>
              <p className="mt-1.5 text-xs text-civic-muted">Leave blank if no amount was named. Totals appear in the side panel of the feed.</p>
            </div>
          )}
        </Section>

        <Section n={3} title="What happened">
          <div>
            <label htmlFor="f-title" className={labelCls}>Headline <span className="font-normal text-civic-muted">({title.length}/120)</span></label>
            <input id="f-title" type="text" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Inspector asked for ₹3,500 cash to clear a driving test" required className={field} />
          </div>
          <div>
            <label htmlFor="f-desc" className={labelCls}>Details</label>
            <textarea id="f-desc" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Date and time, which office or desk, who was involved, and any error message you saw." required className={cn(field, 'leading-relaxed')} />
          </div>
        </Section>

        <Section n={4} title="Photo evidence">
          <p className="text-sm leading-relaxed text-civic-muted">
            Optional. The photo is re-encoded in your browser before it is attached, which drops location, camera and timestamp data. The original file never leaves your device.
          </p>

          {mediaState !== 'done' && (
            <div>
              <label htmlFor="f-photo" className={cn('inline-flex min-h-[40px] cursor-pointer items-center rounded-md border border-civic-border px-4 text-sm font-medium text-civic-text hover:bg-civic-raised focus-within:ring-2 focus-within:ring-civic-accent', mediaState === 'working' && 'pointer-events-none opacity-60')}>
                {mediaState === 'working' ? 'Removing metadata…' : 'Choose a photo'}
                <input id="f-photo" type="file" accept="image/*" onChange={handleFile} disabled={mediaState === 'working'} className="sr-only" />
              </label>
            </div>
          )}

          {mediaState === 'done' && mediaUrl && (
            <figure>
              <img src={mediaUrl} alt="Preview of the photo that will be attached" className="max-h-56 w-full rounded-md border border-civic-border object-cover" />
              <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-civic-muted">
                <span>{mediaNote}</span>
                <Button variant="ghost" size="sm" onClick={removeMedia}>Remove photo</Button>
              </figcaption>
            </figure>
          )}

          <p role={mediaState === 'error' ? 'alert' : 'status'} className={cn('text-sm', mediaState === 'error' ? 'text-civic-red' : 'sr-only')}>
            {mediaState === 'error' ? mediaNote : mediaState === 'working' ? 'Removing metadata' : ''}
          </p>
        </Section>

        <Section n={5} title="Ask your neighbours">
          <p className="text-sm leading-relaxed text-civic-muted">A short poll shows how widespread the problem is. Reports with more votes rise in the feed.</p>
          <div>
            <label htmlFor="f-pq" className={labelCls}>Question</label>
            <input id="f-pq" type="text" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} className={field} />
          </div>
          <div>
            <p className={labelCls}>Answers <span className="font-normal text-civic-muted">(2 to 5)</span></p>
            <ul className="space-y-2">
              {pollOptions.map((opt, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <label htmlFor={`f-opt-${idx}`} className="sr-only">Answer {idx + 1}</label>
                  <span className="w-5 text-right font-mono text-xs text-civic-muted" aria-hidden="true">{idx + 1}</span>
                  <input id={`f-opt-${idx}`} type="text" value={opt} onChange={(e) => setPollOptions(pollOptions.map((o, i) => (i === idx ? e.target.value : o)))} className={field} />
                  {pollOptions.length > 2 && (
                    <Button variant="ghost" size="sm" onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} aria-label={`Remove answer ${idx + 1}`}>Remove</Button>
                  )}
                </li>
              ))}
            </ul>
            {pollOptions.length < 5 && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}>Add an answer</Button>
            )}
          </div>
        </Section>

        <div className="border-t border-civic-border pt-6">
          {formError && <p role="alert" className="mb-3 text-sm text-civic-red">{formError}</p>}
          <Button type="submit" size="lg" disabled={mediaState === 'working'} className="w-full sm:w-auto">Publish report</Button>
          <p className="mt-3 text-xs leading-relaxed text-civic-muted">Publishing adds your report to the public feed in this demo.</p>
        </div>
      </form>

      {submittedId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="done-title" className="w-full max-w-md rounded-t-lg border border-civic-border bg-civic-surface p-6 sm:rounded-lg">
            <h2 id="done-title" ref={successHeading} tabIndex={-1} className="font-display text-2xl font-semibold text-civic-text focus:outline-none">Your report is published</h2>
            <p className="mt-2 text-sm leading-relaxed text-civic-muted">It is now at the top of the feed. Keep this reference number if you want to find the report again.</p>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-civic-border bg-civic-raised px-3 py-2">
              <span className="font-mono text-sm text-civic-accent">{trackingKey}</span>
              <Button variant="ghost" size="sm" onClick={copyKey} aria-live="polite">{copied ? 'Copied' : 'Copy'}</Button>
            </div>
            <p className="mt-2 text-xs text-civic-muted">In this demo the number is not linked to a server yet.</p>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/')}>Back to reports</Button>
              <Button onClick={() => navigate(`/post/${submittedId}`)}>View your report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
