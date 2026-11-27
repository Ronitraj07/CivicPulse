import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, X } from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { Button, cn } from '../components/ui';

const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-accent';
const field = `w-full rounded-md border border-civic-border bg-civic-surface px-3 py-2 text-sm text-civic-text placeholder:text-civic-muted/70 focus:border-civic-accent ${ring}`;

type Filter = 'All' | 'Central' | 'State' | 'IssuesOnly';

const STATUS_STYLE = {
  Down: { text: 'text-civic-red', label: 'Down' },
  Degraded: { text: 'text-civic-amber', label: 'Slow or degraded' },
  Operational: { text: 'text-civic-green', label: 'Operational' },
} as const;

const FAILURES = [
  { value: 'Server Down / Crash', label: 'Server down or crashing (HTTP 500, 502, 504)' },
  { value: 'Payment Deducted & Failed', label: 'Payment deducted but no receipt' },
  { value: 'OTP Not Coming', label: 'OTP never arrives or gateway times out' },
  { value: 'Agent Nexus / Slot Blocking', label: 'Slots vanish in seconds (bots or agent blocking)' },
  { value: 'Captcha Reload Loop', label: 'Captcha keeps reloading' },
  { value: 'Digital Certificate Corrupt', label: 'Certificate or PDF download is corrupt' },
];

export const GovPortalsPage: React.FC = () => {
  const { portals, votePortalIssue, addPortalBug, addPost } = useCivic();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(portals[0]?.portalName || '');
  const [customName, setCustomName] = useState('');
  const [tier, setTier] = useState<'Central' | 'State'>('Central');
  const [failure, setFailure] = useState('Payment Deducted & Failed');
  const [details, setDetails] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [formError, setFormError] = useState('');
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const firstField = useRef<HTMLSelectElement>(null);

  const down = portals.filter((p) => p.status === 'Down').length;
  const degraded = portals.filter((p) => p.status === 'Degraded').length;
  const ok = portals.filter((p) => p.status === 'Operational').length;
  const confirmations = portals.reduce((sum, p) => sum + p.bugReportsCount, 0);

  const visible = portals.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hit = p.portalName.toLowerCase().includes(q) || p.url.toLowerCase().includes(q) || p.commonIssues.some((i) => i.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (filter === 'Central') return p.category === 'Central';
    if (filter === 'State') return p.category === 'State';
    if (filter === 'IssuesOnly') return p.status === 'Down' || p.status === 'Degraded';
    return true;
  });

  useEffect(() => {
    if (!open) return;
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const notify = (msg: string, ms = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  const handleVote = (id: string) => {
    votePortalIssue(id);
    setVoted((prev) => new Set(prev).add(id));
    notify('Recorded. Thanks for confirming.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = target === 'OTHER' ? customName : target;
    if (!name.trim() || !details.trim()) {
      setFormError('Add the portal name and describe what went wrong.');
      return;
    }
    setFormError('');
    const issueTag = errorCode ? `${failure} (${errorCode})` : failure;
    addPortalBug(name, tier, issueTag);
    addPost({
      anonymousHash: `Anon#${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      state: tier === 'Central' ? 'Central Portal' : 'State Portal',
      city: 'National / Online',
      category: 'Gov Website Problem',
      subCategory: failure,
      title: `${name}: ${failure} - Citizens Unable To Proceed`,
      description: `${details}${errorCode ? `\n\nHTTP Error / Code: ${errorCode}` : ''}\n\nReported via the portal outage tracker.`,
      exifStripped: false,
      status: 'Reported',
      pollData: {
        question: `Are you also seeing "${failure}" on ${name}?`,
        totalVotes: 1,
        options: [
          { id: 'opt-1', label: 'Yes, it is happening right now', votes: 1 },
          { id: 'opt-2', label: 'It is extremely slow', votes: 0 },
          { id: 'opt-3', label: 'Working normally for me', votes: 0 },
        ],
      },
    });
    setOpen(false);
    setCustomName('');
    setDetails('');
    setErrorCode('');
    notify('Logged. A linked report now appears in the main feed.', 3500);
  };

  const filterTabs: { key: Filter; label: string }[] = [
    { key: 'All', label: `All (${portals.length})` },
    { key: 'Central', label: 'Central' },
    { key: 'State', label: 'State' },
    { key: 'IssuesOnly', label: `Problems only (${down + degraded})` },
  ];

  return (
    <div>
      {toast && (
        <div role="status" className="fixed bottom-20 right-4 z-50 rounded-md border border-civic-border bg-civic-surface px-4 py-3 text-sm text-civic-text md:bottom-6">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-civic-text">Government portals</h1>
          <p className="mt-2 text-sm leading-relaxed text-civic-muted">
            A citizen-kept log of outages, failed payments, missing OTPs and blocked appointment slots on Indian public portals.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Report a portal problem</Button>
      </div>

      <dl className="mt-6 grid grid-cols-2 divide-civic-border border-y border-civic-border sm:grid-cols-4 sm:divide-x">
        {[
          { label: 'Operational', value: ok, tone: 'text-civic-green' },
          { label: 'Slow or degraded', value: degraded, tone: 'text-civic-amber' },
          { label: 'Down', value: down, tone: 'text-civic-red' },
          { label: 'Citizen confirmations', value: confirmations.toLocaleString('en-IN'), tone: 'text-civic-text' },
        ].map((s) => (
          <div key={s.label} className="px-0 py-3 sm:px-4 sm:first:pl-0">
            <dt className="text-xs text-civic-muted">{s.label}</dt>
            <dd className={cn('mt-0.5 font-mono text-xl', s.tone)}>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-civic-border">
        <div className="flex gap-6 overflow-x-auto" role="group" aria-label="Filter portals">
          {filterTabs.map((t) => (
            <button key={t.key} type="button" aria-pressed={filter === t.key} onClick={() => setFilter(t.key)}
              className={cn('-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors', ring, filter === t.key ? 'border-civic-accent text-civic-text' : 'border-transparent text-civic-muted hover:text-civic-text')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative mb-2 w-full sm:w-60" role="search">
          <label htmlFor="portal-search" className="sr-only">Search portals</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-civic-muted" aria-hidden="true" />
          <input id="portal-search" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search portal or problem" className={cn(field, 'py-1.5 pl-9 pr-8 text-xs [&::-webkit-search-cancel-button]:hidden')} />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className={cn('absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-civic-muted hover:text-civic-text', ring)}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="font-display text-xl font-semibold text-civic-text">No portals match</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-civic-muted">Try a different keyword, or report this portal so it gets tracked.</p>
            <Button variant="secondary" className="mt-4" onClick={() => { setSearchQuery(''); setFilter('All'); }}>Reset filters</Button>
          </div>
        ) : (
          visible.map((portal) => {
            const st = STATUS_STYLE[portal.status];
            const hasVoted = voted.has(portal.id);
            return (
              <article key={portal.id} className="border-b border-civic-border py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-display text-xl font-semibold text-civic-text">
                    {portal.portalName}
                    <span className="ml-2 font-sans text-xs font-normal text-civic-muted">{portal.category}</span>
                  </h2>
                  <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', st.text)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    {st.label}
                  </span>
                </div>

                <a href={portal.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-civic-blue hover:underline">
                  {portal.url} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>

                <div className="mt-3">
                  <p className="text-xs text-civic-muted">Problems people report</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {portal.commonIssues.map((issue) => (
                      <li key={issue} className="rounded-sm border border-civic-border px-2 py-0.5 text-xs text-civic-text/90">{issue}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-civic-muted">
                    Checked {portal.lastChecked} · <span className="font-mono text-civic-text">{portal.bugReportsCount}</span> confirmations
                  </p>
                  <div className="flex items-center gap-2">
                    <Link to="/" className={cn('inline-flex min-h-[32px] items-center rounded-md px-3 text-xs font-medium text-civic-muted hover:bg-civic-raised hover:text-civic-text', ring)}>Related reports</Link>
                    <Button size="sm" variant="secondary" aria-pressed={hasVoted} disabled={hasVoted} onClick={() => handleVote(portal.id)}>
                      {hasVoted ? 'Recorded' : 'I am affected too'}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="bug-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-civic-border bg-civic-surface p-6 sm:rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <h2 id="bug-title" className="font-display text-2xl font-semibold text-civic-text">Report a portal problem</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className={cn('rounded p-1 text-civic-muted hover:text-civic-text', ring)}><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-civic-text">Who runs the portal?</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(['Central', 'State'] as const).map((t) => (
                    <label key={t} className={cn('flex min-h-[40px] cursor-pointer items-center justify-center rounded-md border text-sm', tier === t ? 'border-civic-accent text-civic-text' : 'border-civic-border text-civic-muted hover:text-civic-text')}>
                      <input type="radio" name="tier" value={t} checked={tier === t} onChange={() => setTier(t)} className="sr-only" />
                      {t === 'Central' ? 'Central government' : 'State or municipal'}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="bug-portal" className="mb-1.5 block text-sm font-medium text-civic-text">Portal</label>
                <select id="bug-portal" ref={firstField} value={target} onChange={(e) => setTarget(e.target.value)} className={field}>
                  {portals.map((p) => (<option key={p.id} value={p.portalName}>{p.portalName} ({p.category})</option>))}
                  <option value="OTHER">Another website (type it below)</option>
                </select>
              </div>

              {target === 'OTHER' && (
                <div>
                  <label htmlFor="bug-custom" className="mb-1.5 block text-sm font-medium text-civic-text">Portal name and address</label>
                  <input id="bug-custom" type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="For example: Mahavitaran billing (mahadiscom.in)" className={field} />
                </div>
              )}

              <div>
                <label htmlFor="bug-failure" className="mb-1.5 block text-sm font-medium text-civic-text">What went wrong</label>
                <select id="bug-failure" value={failure} onChange={(e) => setFailure(e.target.value)} className={field}>
                  {FAILURES.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                </select>
              </div>

              <div>
                <label htmlFor="bug-code" className="mb-1.5 block text-sm font-medium text-civic-text">Error code or page <span className="font-normal text-civic-muted">(optional)</span></label>
                <input id="bug-code" type="text" value={errorCode} onChange={(e) => setErrorCode(e.target.value)} placeholder="ERR_CONNECTION_TIMED_OUT, or HTTP 500 at /payment" className={cn(field, 'font-mono')} />
              </div>

              <div>
                <label htmlFor="bug-details" className="mb-1.5 block text-sm font-medium text-civic-text">What happened</label>
                <textarea id="bug-details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Your browser, the time you tried, and the bank reference if money was deducted." className={field} />
              </div>

              <p className="border-l-2 border-civic-blue pl-3 text-xs leading-relaxed text-civic-muted">
                This updates the outage log and also posts a linked report with a poll in the main feed.
              </p>

              {formError && <p role="alert" className="text-sm text-civic-red">{formError}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Publish report</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
