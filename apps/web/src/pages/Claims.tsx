import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClaims, type ClaimData } from '@medicare/shared';
import styles from '../App.module.css';

const PAGE_SIZE = 5;

const DATE_RANGES = [
  { label: 'All Time',       value: 'all' },
  { label: 'Last 30 Days',   value: '30days' },
  { label: 'Last 90 Days',   value: '90days' },
  { label: 'Last 6 Months',  value: '6months' },
  { label: 'Last Year',      value: '1year' },
];

function claimMatchesDateRange(claim: ClaimData, range: string): boolean {
  if (range === 'all') return true;
  const claimDate = new Date(claim.date);
  const now = new Date();
  const days = range === '30days' ? 30 : range === '90days' ? 90 : range === '6months' ? 180 : 365;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return claimDate >= cutoff;
}

export default function Claims() {
  const navigate = useNavigate();
  const { data: claimsData, isLoading } = useClaims() as { data: ClaimData[] | undefined; isLoading: boolean };

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus]       = useState('');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterProvider, setFilterProvider]   = useState('');

  function goToPage(page: number) { setCurrentPage(page); }

  function clearFilters() {
    setFilterStatus('');
    setFilterDateRange('all');
    setFilterProvider('');
    setCurrentPage(1);
  }

  const hasActiveFilters = filterStatus !== '' || filterDateRange !== 'all' || filterProvider !== '';

  const filteredClaims = useMemo(() => {
    let result = claimsData ?? [];
    if (filterStatus)     result = result.filter(c => c.status === filterStatus);
    if (filterProvider)   result = result.filter(c => c.provider.toLowerCase().includes(filterProvider.toLowerCase()));
    if (filterDateRange !== 'all') result = result.filter(c => claimMatchesDateRange(c, filterDateRange));
    return result;
  }, [claimsData, filterStatus, filterProvider, filterDateRange]);

  const totalClaims = filteredClaims.length;
  const totalPages = Math.max(1, Math.ceil(totalClaims / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageClaims = filteredClaims.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const startItem = totalClaims === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, totalClaims);

  return (
    <main className="box-border min-h-screen" style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Hero Banner */}
      <section className="bg-primary text-white rounded-3xl p-10 lg:p-14 mb-8 flex flex-col lg:flex-row justify-between items-center relative overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,52,97,0.25)' }}>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none bg-gradient-to-l from-white/10 to-transparent">
          {/* Subtle concentric circles */}
          <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] rounded-full border border-white/30"></div>
          <div className="absolute right-[5%] top-[5%] w-[400px] h-[400px] rounded-full border border-white/20"></div>
        </div>
        
        <div className="max-w-3xl relative z-10">
          <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8 inline-block">
            AI Concierge
          </span>
          <h1 className="font-headline text-5xl font-extrabold mb-6 tracking-tight">Good morning, Martha.</h1>
          <p className="text-xl text-primary-fixed mb-10 leading-relaxed font-body">
            I've reviewed your recent activity. Your outpatient claim from <span className="font-bold text-white">St. Mary's Medical</span> was processed today. Your total member responsibility is <span className="font-bold text-white">$42.50</span>. Would you like to set up a payment now?
          </p>
          <div className="flex gap-4">
            <button className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white px-8 py-3.5 rounded-lg font-bold flex items-center transition-all shadow-sm">
              Pay Now <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
            </button>
            <button 
              onClick={() => navigate('/claims/0')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-lg font-bold border border-white/20 transition-all font-body"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative z-10 w-64 h-64 border-[10px] border-[#004882] rounded-full p-2 bg-[#001c38]">
           <div className="w-full h-full rounded-full border border-[#00658d] relative flex items-center justify-center bg-gradient-to-br from-[#003461] to-[#001e2d] overflow-hidden">
              <svg className="w-full h-full opacity-30 absolute" viewBox="0 0 100 100">
                <path d="M0 50 Q 25 20, 50 50 T 100 50" fill="none" stroke="#41befd" strokeWidth="2" opacity="0.6"/>
                <path d="M0 60 Q 25 30, 50 60 T 100 60" fill="none" stroke="#81cfff" strokeWidth="1" opacity="0.4"/>
              </svg>
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
           </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white rounded-2xl p-8 mb-10 border border-outline-variant/30 relative" style={{ boxShadow: '0 4px 18px rgba(0,52,97,0.08)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
            <span className="material-symbols-outlined">filter_list</span>
            Filter Claims
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {[filterStatus, filterDateRange !== 'all' ? filterDateRange : '', filterProvider].filter(Boolean).length} active
              </span>
            )}
          </h3>
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="text-secondary font-bold text-sm hover:underline disabled:opacity-30 disabled:pointer-events-none"
          >
            Clear all filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Status</label>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface font-medium appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Processed">Processed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Paid">Paid</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Date Range</label>
            <div className="relative">
              <select
                value={filterDateRange}
                onChange={e => { setFilterDateRange(e.target.value); setCurrentPage(1); }}
                className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface font-medium appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {DATE_RANGES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">calendar_today</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Provider</label>
            <div className="relative">
              <input
                value={filterProvider}
                onChange={e => { setFilterProvider(e.target.value); setCurrentPage(1); }}
                placeholder="Search provider..."
                className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary placeholder-outline"
              />
              {filterProvider ? (
                <button onClick={() => { setFilterProvider(''); setCurrentPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              ) : (
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">search</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Member</label>
            <div className="relative">
              <select className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface font-medium appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                <option>Martha (Subscriber)</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Claims List Header */}
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary">Recent Claims</h2>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">
            {isLoading ? 'Loading claims…' : `Showing ${startItem}–${endItem} of ${totalClaims} claims`}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="text-primary hover:bg-surface-container p-2 rounded-lg transition-colors"><span className="material-symbols-outlined">download</span></button>
          <button className="text-primary hover:bg-surface-container p-2 rounded-lg transition-colors"><span className="material-symbols-outlined">print</span></button>
        </div>
      </div>

      {/* Claims Cards */}
      <div className="flex flex-col gap-5 mb-14">
        {isLoading && [0,1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row p-8 items-center gap-8 relative overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,52,97,0.06)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-surface-container-high" />
            <div className="flex-1 min-w-[200px] ml-2 flex flex-col gap-3">
              <div className={styles.skeleton} style={{ height: 11, width: 60 }} />
              <div className={styles.skeleton} style={{ height: 22, width: 180 }} />
              <div className={styles.skeleton} style={{ height: 14, width: 130 }} />
            </div>
            <div className="w-1/4 min-w-[150px] flex flex-col gap-3">
              <div className={styles.skeleton} style={{ height: 11, width: 80 }} />
              <div className={styles.skeleton} style={{ height: 20, width: 110 }} />
              <div className={styles.skeleton} style={{ height: 13, width: 90 }} />
            </div>
            <div className="w-1/4 flex flex-col gap-3">
              <div className={styles.skeleton} style={{ height: 11, width: 50 }} />
              <div className={styles.skeleton} style={{ height: 28, width: 110, borderRadius: 20 }} />
            </div>
            <div className="w-1/5 flex flex-col items-end gap-3 pl-4 border-l border-outline-variant/30">
              <div className={styles.skeleton} style={{ height: 11, width: 80 }} />
              <div className={styles.skeleton} style={{ height: 36, width: 90 }} />
            </div>
          </div>
        ))}
        {pageClaims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => navigate(`/claims/${claim.id}`)}
            className={`group bg-white rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row p-8 cursor-pointer items-center gap-8 relative overflow-hidden ${styles.hoverLift}`}
            style={{ boxShadow: '0 2px 8px rgba(0,52,97,0.07)' }}
          >
            {/* Status Colored Lead Border */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${claim.status === 'Processed' ? 'bg-secondary-container' : claim.status === 'Pending Review' ? 'bg-tertiary-container' : 'bg-secondary-container'}`}></div>

            <div className="flex-1 min-w-[200px] ml-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Provider</span>
              <h4 className="font-headline font-extrabold text-xl text-primary">{claim.provider}</h4>
              <p className="text-sm text-on-surface-variant mt-1 font-medium">{claim.type}</p>
            </div>

            <div className="w-1/4 min-w-[150px]">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Date of Service</span>
              <p className="font-bold text-lg text-on-surface">{claim.date}</p>
              <p className="text-sm text-outline italic mt-1">Claim #{claim.id}</p>
            </div>

            <div className="w-1/4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Status</span>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                claim.status === 'Processed' ? 'bg-secondary-container/20 text-on-secondary-container' :
                claim.status === 'Pending Review' ? 'bg-[#793701] text-white' :
                'bg-secondary-container text-on-secondary-fixed'
              }`}>
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {claim.status === 'Processed' || claim.status === 'Paid' ? 'check_circle' : 'sync'}
                </span>
                {claim.status}
              </div>
            </div>

            <div className="w-1/5 text-right pl-4 border-l border-outline-variant/30 relative">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Responsibility</span>
              <p className="font-extrabold text-3xl text-primary">${claim.memberResponsibility.toFixed(2)}</p>
              <span className="material-symbols-outlined absolute right-[-24px] top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-secondary">chevron_right</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!isLoading && totalClaims === 0 && (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl mb-4 block opacity-40">search_off</span>
          <p className="text-xl font-bold text-primary mb-2">No claims found</p>
          <p className="text-sm mb-6">Try adjusting your filters to see more results.</p>
          <button onClick={clearFilters} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => goToPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="flex items-center text-primary font-bold px-4 py-2 hover:bg-surface-container rounded-lg mr-4 group disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="material-symbols-outlined text-sm mr-1 group-hover:-translate-x-1 transition-transform">chevron_left</span> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-colors ${
                page === safePage
                  ? 'bg-primary text-white shadow-md'
                  : 'text-primary hover:bg-surface-container'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="flex items-center text-primary font-bold px-4 py-2 hover:bg-surface-container rounded-lg ml-4 group disabled:opacity-30 disabled:pointer-events-none"
          >
            Next <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      )}
    </main>
  );
}
