import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProviders } from '@medicare/shared';
import type { ProviderData } from '@medicare/shared';
import { DoctorAvatar } from '@medicare/ui';
import styles from '../App.module.css';

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Primary Care', 'Cardiology', 'Internal Medicine', 'Physical Therapy',
  'Dermatology', 'Orthopedics', 'Neurology', 'Gastroenterology', 'Psychiatry', 'Ophthalmology',
];

const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Nearest',       value: 'distance' },
  { label: 'Next Available', value: 'availability' },
  { label: 'Name A–Z',      value: 'name' },
];

const MAP_PINS = [
  { left: '22%', top: '42%' }, { left: '48%', top: '58%' },
  { left: '65%', top: '30%' }, { left: '38%', top: '70%' },
  { left: '72%', top: '55%' }, { left: '18%', top: '65%' },
];

const PAGE_SIZE = 5;

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8 flex gap-8"
      style={{ boxShadow: '0 20px 40px -10px rgba(0,52,97,0.10)' }}>
      <div className={styles.skeleton} style={{ width: 160, height: 160, borderRadius: 16, flexShrink: 0 }} />
      <div className="flex-1 flex flex-col gap-4 pt-2">
        <div className="flex gap-3">
          <div className={styles.skeleton} style={{ height: 24, width: 120, borderRadius: 8 }} />
          <div className={styles.skeleton} style={{ height: 24, width: 100, borderRadius: 8 }} />
        </div>
        <div className={styles.skeleton} style={{ height: 32, width: 260 }} />
        <div className={styles.skeleton} style={{ height: 18, width: 200 }} />
        <div className={styles.skeleton} style={{ height: 60, width: '90%', borderRadius: 12, marginTop: 4 }} />
        <div className="flex gap-4 mt-2">
          <div className={styles.skeleton} style={{ height: 44, width: 160, borderRadius: 12 }} />
          <div className={styles.skeleton} style={{ height: 44, width: 120, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}

// ── ProviderCard ─────────────────────────────────────────────────────────────
function ProviderCard({ provider, isSmartMatch }: { provider: ProviderData; isSmartMatch: boolean }) {
  const isBooked = provider.nextAvailable === null;

  return (
    <div
      className={`group relative bg-surface-container-lowest rounded-2xl p-8 flex flex-col md:flex-row gap-8 transition-all duration-300 ${styles.hoverLift}`}
      style={{
        boxShadow: isSmartMatch
          ? '0 25px 50px -12px rgba(0,75,135,0.20)'
          : '0 20px 40px -10px rgba(0,52,97,0.10)',
        border: isSmartMatch ? '2px solid rgba(0,75,135,0.25)' : '2px solid transparent',
      }}
    >
      {/* Smart Match badge */}
      {isSmartMatch && (
        <div className="absolute top-0 right-0 bg-primary text-on-primary px-5 py-2 font-bold text-xs flex items-center gap-2 z-10"
          style={{ borderRadius: '0 16px 0 16px', letterSpacing: '0.08em' }}>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          SMART MATCH
        </div>
      )}

      {/* Avatar */}
      <DoctorAvatar
        name={provider.name}
        category={provider.category}
        providerId={provider.id}
        size={160}
        dimmed={isBooked}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase font-label">
              {provider.category}
            </span>
            <div className="flex items-center gap-1 text-sm font-bold text-tertiary-container">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {provider.rating.toFixed(1)}
              {isSmartMatch && <span className="text-on-surface-variant font-normal">(124 reviews)</span>}
            </div>
            {provider.inNetwork && (
              <span className="flex items-center gap-1 bg-primary/8 text-primary text-xs font-bold px-3 py-1 rounded-full font-label"
                style={{ background: 'rgba(0,52,97,0.08)' }}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                In-Network
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="font-headline font-extrabold text-2xl text-primary mb-1 tracking-tight">{provider.name}</h2>
          <p className="text-on-surface-variant font-medium mb-4 font-body">
            {provider.specialty}
            {provider.yearsExperience != null && ` · ${provider.yearsExperience} years experience`}
          </p>

          {/* Smart Match insight box */}
          {isSmartMatch && (
            <div className="p-4 rounded-xl mb-4"
              style={{ background: 'rgba(0,52,97,0.04)', borderLeft: '4px solid rgba(0,52,97,0.3)' }}>
              <h4 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1 flex items-center gap-2 font-label">
                <span className="material-symbols-outlined text-xs">psychology_alt</span>
                Smart Match Insight
              </h4>
              <p className="text-on-surface text-sm font-medium leading-relaxed font-body">
                Top-rated for your plan area · Highest match confidence based on specialty and availability.
              </p>
            </div>
          )}

          {/* Bio */}
          {provider.bio && (
            <p className="text-on-surface/70 text-sm leading-relaxed font-body max-w-2xl">
              {provider.bio}
            </p>
          )}
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <button
            disabled={isBooked}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all font-label ${isBooked ? 'bg-primary/30 text-white cursor-not-allowed' : 'bg-primary text-on-primary hover:-translate-y-0.5 active:scale-95'}`}
            style={!isBooked ? { boxShadow: '0 4px 15px rgba(0,52,97,0.30)' } : undefined}
          >
            {isBooked ? 'Fully Booked' : 'Book Appointment'}
          </button>
          <Link
            to={`/find-care/${provider.id}`}
            className="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all font-label"
          >
            View Details
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant ml-auto font-body">
            <span className="material-symbols-outlined text-base">location_on</span>
            {provider.distance} miles away
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FindCare page ─────────────────────────────────────────────────────────────
export default function FindCare() {
  const [searchInput, setSearchInput]              = useState('');
  const [committedSearch, setCommittedSearch]      = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterInNetwork, setFilterInNetwork]      = useState(false);
  const [minRating, setMinRating]                  = useState(0);
  const [maxDistance, setMaxDistance]              = useState(25);
  const [sortBy, setSortBy]                        = useState('rating');
  const [currentPage, setCurrentPage]              = useState(1);
  const [hasSearched, setHasSearched]              = useState(false);
  const [showMap, setShowMap]                      = useState(true);
  const [activeSection, setActiveSection]          = useState<'smart' | 'specialty' | 'availability' | 'insurance' | 'rating'>('smart');

  // Always-on fetch for Smart Match — independent of search state
  const { data: allProvidersPool = [], isLoading: poolLoading } = useProviders({}, { enabled: true }) as {
    data: ProviderData[]; isLoading: boolean;
  };

  // Smart Match = highest-rated in-network provider across the full pool
  const smartMatch = useMemo<ProviderData | null>(() => {
    const inNet = allProvidersPool.filter(p => p.inNetwork);
    if (inNet.length === 0) return allProvidersPool[0] ?? null;
    return inNet.reduce((best, p) => (p.rating > best.rating ? p : best), inNet[0]);
  }, [allProvidersPool]);

  // Search-gated fetch — same cache key as above so no extra request after first load
  const { data: allProviders = [], isLoading } = useProviders({}, { enabled: hasSearched }) as {
    data: ProviderData[]; isLoading: boolean;
  };

  function applyAndSearch() {
    setCommittedSearch(searchInput);
    setCurrentPage(1);
    setHasSearched(true);
  }

  function toggleCategory(cat: string) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  const filteredProviders = useMemo(() => {
    if (!hasSearched) return [];
    let result = [...allProviders].filter(p => p.id !== smartMatch?.id); // exclude Smart Match
    if (committedSearch) {
      const q = committedSearch.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) result = result.filter(p => selectedCategories.includes(p.category));
    if (filterInNetwork)  result = result.filter(p => p.inNetwork);
    if (minRating > 0)    result = result.filter(p => p.rating >= minRating);
    if (maxDistance > 0)  result = result.filter(p => p.distance <= maxDistance);
    if (sortBy === 'distance')     result.sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'rating')  result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'name')    result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'availability') {
      result.sort((a, b) => {
        if (a.nextAvailable === null) return 1;
        if (b.nextAvailable === null) return -1;
        if (!a.nextAvailable) return 1;
        if (!b.nextAvailable) return -1;
        return 0;
      });
    }
    return result;
  }, [allProviders, hasSearched, smartMatch, committedSearch, selectedCategories, filterInNetwork, minRating, maxDistance, sortBy]);

  const totalProviders = filteredProviders.length;
  const totalPages = Math.max(1, Math.ceil(totalProviders / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProviders = filteredProviders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function getPageButtons(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (safePage > 3) pages.push('...');
    for (let p = Math.max(2, safePage - 1); p <= Math.min(totalPages - 1, safePage + 1); p++) pages.push(p);
    if (safePage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  // Sidebar section filter content
  const sidebarSections = [
    { id: 'smart',        icon: 'filter_list',   label: 'Smart Filters' },
    { id: 'specialty',    icon: 'medical_services', label: 'Specialty' },
    { id: 'availability', icon: 'event_available', label: 'Availability' },
    { id: 'insurance',    icon: 'verified_user',  label: 'Insurance' },
    { id: 'rating',       icon: 'star',           label: 'Rating' },
  ] as const;

  return (
    <div className="flex bg-surface">

      {/* ── Fixed Left Sidebar ──────────────────────────────────────────── */}
      <aside
        className="fixed left-0 z-40 overflow-y-auto flex flex-col bg-surface-container-low"
        style={{
          top: 72, width: 288,
          height: 'calc(100vh - 72px)',
          boxShadow: '4px 0 24px rgba(0,52,97,0.08)',
        }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="font-headline font-bold text-xl text-primary">Care Filters</h2>
          <p className="text-on-surface-variant text-xs font-medium mt-1 font-body">Refine your sanctuary</p>
        </div>

        {/* Section nav */}
        <nav className="space-y-1">
          {sidebarSections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center gap-3 py-3 px-8 text-sm font-semibold transition-all duration-200 font-label ${
                activeSection === sec.id
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:translate-x-1 hover:text-primary'
              }`}
              style={activeSection === sec.id ? { borderRadius: '0 9999px 9999px 0' } : undefined}
            >
              <span className="material-symbols-outlined text-lg">{sec.icon}</span>
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Filter content */}
        <div className="px-8 mt-8 flex-1 space-y-6">

          {/* Specialty checkboxes (Smart Filters + Specialty sections) */}
          {(activeSection === 'smart' || activeSection === 'specialty') && (
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors font-body font-medium">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* In-Network (Smart Filters + Insurance) */}
          {(activeSection === 'smart' || activeSection === 'insurance') && (
            <div className="flex items-center justify-between py-4 px-5 rounded-2xl"
              style={{ background: 'rgba(0,52,97,0.04)', border: '1px solid rgba(0,52,97,0.08)' }}>
              <span className="font-bold text-primary text-sm font-label">In-Network Only</span>
              <button
                role="switch"
                aria-checked={filterInNetwork}
                aria-label="In-Network Only"
                onClick={() => setFilterInNetwork(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${filterInNetwork ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filterInNetwork ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          )}

          {/* Rating (Smart Filters + Rating) */}
          {(activeSection === 'smart' || activeSection === 'rating') && (
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-3 font-label">Min Rating</p>
              <div className="flex gap-2">
                {[{ label: '3+', v: 3 }, { label: '4+', v: 4 }, { label: '4.5+', v: 4.5 }].map(r => (
                  <button key={r.v}
                    onClick={() => setMinRating(minRating === r.v ? 0 : r.v)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all font-label ${minRating === r.v ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Distance (Smart Filters + Availability) */}
          {(activeSection === 'smart' || activeSection === 'availability') && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant font-label">Distance</p>
                <span className="text-primary font-extrabold text-sm">{maxDistance} mi</span>
              </div>
              <input type="range" min={1} max={50} value={maxDistance}
                onChange={e => setMaxDistance(Number(e.target.value))}
                className="w-full h-1.5 appearance-none cursor-pointer rounded-full"
                style={{ background: `linear-gradient(to right, #003461 0%, #003461 ${(maxDistance - 1) / 49 * 100}%, #e1e3e4 ${(maxDistance - 1) / 49 * 100}%, #e1e3e4 100%)` }}
              />
              <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#003461;cursor:pointer;border:3px solid white;box-shadow:0 2px 6px rgba(0,52,97,0.3);}`}</style>
            </div>
          )}
        </div>

        {/* Apply Filters */}
        <div className="px-8 pb-8 pt-6">
          <button
            onClick={applyAndSearch}
            className="w-full py-3 bg-secondary text-on-secondary rounded-xl font-bold text-sm shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-95 font-label"
            style={{ boxShadow: '0 4px 16px rgba(0,101,141,0.30)' }}
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 bg-surface" style={{ marginLeft: 288 }}>

        {/* Map hero */}
        <section className="relative w-full overflow-hidden border-b border-surface-container-high"
          style={{ height: 300 }}>
          {/* SVG map */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, #c9dce8 0%, #b8cfe0 25%, #cfdec9 55%, #b8d4b4 100%)' }}>
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapgrid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#003461" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" />
            </svg>
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="12" />
              <line x1="0" y1="28%" x2="100%" y2="28%" stroke="white" strokeWidth="5" />
              <line x1="33%" y1="0" x2="33%" y2="100%" stroke="white" strokeWidth="8" />
              <line x1="60%" y1="0" x2="62%" y2="100%" stroke="white" strokeWidth="5" />
            </svg>
            {/* Map pins */}
            {hasSearched && pageProviders.slice(0, 6).map((p, i) => {
              const pos = MAP_PINS[i] ?? { left: `${15 + i * 12}%`, top: '45%' };
              return (
                <div key={p.id} className="absolute flex flex-col items-center"
                  style={{ left: pos.left, top: pos.top, transform: 'translate(-50%,-50%)' }}>
                  <div className={`w-10 h-10 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center ${p.inNetwork ? 'bg-primary' : 'bg-outline'}`}>
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                  </div>
                  <div className="w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `8px solid ${p.inNetwork ? '#003461' : '#727781'}` }} />
                </div>
              );
            })}
            {/* gradient fade at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to bottom, transparent, #f8f9fa)' }} />
          </div>

          {/* Show/Hide Map toggle */}
          <div className="absolute bottom-6 right-8">
            <div className="flex items-center bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary-container/20"
              style={{ boxShadow: '0 4px 20px rgba(0,52,97,0.12)' }}>
              <span className="text-sm font-bold text-primary mr-3 font-label">Show Full Map</span>
              <button
                role="switch"
                aria-checked={showMap}
                aria-label="Show Full Map"
                onClick={() => setShowMap(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${showMap ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showMap ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Content area */}
        <div className={styles.pageWrap}>

          {/* Search & heading */}
          <section className="mb-12">
            <h1 className="font-headline text-4xl font-extrabold text-primary mb-2 tracking-tight">
              Find Your Specialist
            </h1>
            <p className="text-on-surface-variant mb-8 max-w-2xl font-body">
              Access our network of premium providers and personalized care recommendations designed for your recovery journey.
            </p>
            <div className="flex flex-col md:flex-row items-stretch gap-4 bg-surface-container-lowest p-4 rounded-2xl"
              style={{ boxShadow: '0 20px 40px -10px rgba(0,52,97,0.12)' }}>
              <div className="flex-1 flex items-center bg-surface-container-low rounded-xl px-4 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                <span className="material-symbols-outlined text-outline">search</span>
                <input
                  className="bg-transparent border-none outline-none w-full py-4 px-4 text-on-surface placeholder:text-outline/60 font-medium font-body text-base"
                  placeholder="Search by name, specialty, or condition..."
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyAndSearch()}
                />
                {searchInput && (
                  <button onClick={() => setSearchInput('')} aria-label="Clear search" className="text-outline hover:text-primary p-1">
                    <span className="material-symbols-outlined text-base" aria-hidden="true">close</span>
                  </button>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={applyAndSearch}
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all active:scale-95 font-label"
                  style={{ boxShadow: '0 4px 15px rgba(0,52,97,0.30)' }}
                >
                  <span className="material-symbols-outlined text-lg">search</span>
                  Search
                </button>
                <button
                  onClick={applyAndSearch}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white hover:-translate-y-0.5 transition-all active:scale-95 font-label"
                  style={{ background: 'linear-gradient(135deg, #00658d, #41befd)', boxShadow: '0 4px 15px rgba(0,101,141,0.25)' }}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  Ask AI
                </button>
              </div>
            </div>
          </section>

          {/* Smart Match — always visible */}
          <section className="mb-10">
            <h3 className="font-headline text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1", color: '#41befd' }}>auto_awesome</span>
              Smart Match For You
            </h3>
            {poolLoading ? (
              <SkeletonCard />
            ) : smartMatch ? (
              <ProviderCard provider={smartMatch} isSmartMatch={true} />
            ) : null}
          </section>

          {/* Regular results — only after search */}
          {hasSearched && (
            <section>
              <div className="flex items-baseline justify-between mb-8">
                <h3 className="font-headline text-xl font-bold text-primary">
                  {isLoading ? 'Searching…' : `Other Providers (${totalProviders})`}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-on-surface-variant font-body">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="text-sm font-bold text-primary bg-transparent border-none p-0 outline-none cursor-pointer font-label"
                  >
                    {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : totalProviders === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-6xl block mb-4 opacity-30 text-primary">search_off</span>
                  <p className="font-headline text-xl font-extrabold text-primary mb-2">No other providers found</p>
                  <p className="text-on-surface-variant font-body mb-6">Try adjusting your filters or search term.</p>
                  <button
                    onClick={() => { setSelectedCategories([]); setFilterInNetwork(false); setMinRating(0); setCurrentPage(1); }}
                    className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all font-label"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {pageProviders.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} isSmartMatch={false} />
                  ))}
                </div>
              )}

              {!isLoading && totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_left</span>
                  </button>

                  {getPageButtons().map((page, idx) =>
                    page === '...' ? (
                      <span key={`e${idx}`} className="text-on-surface-variant px-1 font-bold">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                          page === safePage ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_right</span>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Pre-search prompt shown below Smart Match */}
          {!hasSearched && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(0,52,97,0.06)' }}>
                <span className="material-symbols-outlined text-4xl text-primary/40">manage_search</span>
              </div>
              <p className="font-headline text-xl font-extrabold text-primary mb-2">Find more providers</p>
              <p className="text-on-surface-variant max-w-sm font-body">
                Use the search bar above or apply filters in the sidebar to discover additional providers.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
