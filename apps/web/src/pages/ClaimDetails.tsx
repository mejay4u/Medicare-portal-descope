import { Link, useParams } from 'react-router-dom';
import { useClaim, type ClaimData } from '@medicare/shared';
import styles from '../App.module.css';

const JOURNEY_ICONS: Record<string, string> = {
  Received: 'inventory_2',
  Review: 'search',
  Processed: 'settings',
  Paid: 'payments',
};

export default function ClaimDetails() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: claim, isLoading } = useClaim(id) as { data: ClaimData | undefined; isLoading: boolean };

  return (
    <main className={styles.pageWrap}>

      {/* Breadcrumb & Pathing */}
      <div className="flex items-center text-sm font-bold mb-8 text-on-surface-variant gap-2">
        <Link to="/claims" className="hover:text-primary transition-colors">Claims</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-primary">Claim Details</span>
      </div>

      {isLoading && <div className="text-center py-32 text-on-surface-variant font-medium">Loading claim details...</div>}
      {!isLoading && !claim && <div className="text-center py-32 text-on-surface-variant font-medium">Claim not found.</div>}

      {claim && (
        <>
          {/* Top Graphic Card */}
          <section className="bg-white rounded-3xl p-10 mb-12 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center relative" style={{ borderTopLeftRadius: '3rem', borderBottomLeftRadius: 8 }}>
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-primary rounded-l-[3rem]"></div>

            <div className="ml-4 mb-6 md:mb-0">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">{claim.category}</span>
              <h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-4">{claim.provider}</h1>
              <div className="flex items-center gap-6 text-on-surface-variant font-medium">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span> {claim.serviceDate}
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span> Claim #{claim.id}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 ml-4">
              <button className="flex items-center justify-center gap-2 border-2 border-outline-variant/50 text-primary px-8 py-3.5 rounded-xl font-bold bg-white hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined">download</span> Download EOB
              </button>
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold border border-primary hover:bg-primary-container transition-all shadow-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span> Message a Care Guide
              </button>
            </div>
          </section>

          {/* Medical & Provider Details Grid */}
          <h3 className="font-headline text-2xl font-bold text-primary mb-6">Medical & Provider Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col pt-10">
              <div className="flex items-center gap-3 text-primary font-bold mb-8">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                Rendering Provider
              </div>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Provider Name</span>
              <p className="font-extrabold text-lg text-primary mb-6">{claim.doctor}</p>

              <span className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Provider ID / NPI</span>
              <p className="font-extrabold text-base text-on-surface mb-6">{claim.doctorNpi}</p>

              <span className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Service Address</span>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{claim.address}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col pt-10">
              <div className="flex items-center gap-3 text-primary font-bold mb-8">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
                Clinical Diagnosis
              </div>
              {claim.diagnoses.map((d, i) => (
                <div key={i} className={`flex gap-4 items-start ${i < claim.diagnoses.length - 1 ? 'mb-6' : ''}`}>
                  <span className="bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1 rounded-md mt-1 shrink-0">{d.code}</span>
                  <div>
                    <p className="font-extrabold text-primary leading-tight mb-1">{d.title}</p>
                    <p className="text-xs text-outline font-medium">{d.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col pt-10">
              <div className="flex items-center gap-3 text-primary font-bold mb-8">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
                Services Rendered
              </div>
              {claim.services.map((s, i) => (
                <div key={i} className={`flex gap-4 items-start ${i < claim.services.length - 1 ? 'mb-6' : ''}`}>
                  <span className="bg-secondary-container text-white text-xs font-bold px-3 py-1 rounded-md mt-1 shrink-0">{s.code}</span>
                  <div>
                    <p className="font-extrabold text-primary leading-tight mb-1">{s.title}</p>
                    <p className="text-xs text-outline font-medium">{s.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Claim Journey Flow */}
          <h3 className="font-headline text-2xl font-bold text-primary mb-6">Claim Journey</h3>
          <div className="bg-white rounded-3xl p-12 mb-12 shadow-sm border border-outline-variant/30 relative">
            {(() => {
              const lastComplete = claim.journey.filter(j => j.complete).length;
              const totalSteps = claim.journey.length;
              const trackPct = totalSteps > 1 ? Math.round(((lastComplete - 1) / (totalSteps - 1)) * 100) : 0;
              return (
                <div className="flex items-start justify-between relative px-8 z-10 w-full max-w-5xl mx-auto">
                  <div className="absolute top-7 left-[5%] right-[5%] h-1.5 bg-surface-container-high z-0"></div>
                  <div className="absolute top-7 left-[5%] h-1.5 bg-primary z-0" style={{ right: `${100 - trackPct}%` }}></div>
                  {claim.journey.map((step) => (
                    <div key={step.step} className={`flex flex-col items-center gap-4 relative z-10 w-32 ${!step.complete ? 'opacity-40' : ''}`}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-8 ring-white shadow-sm ${step.complete ? 'bg-primary text-white hover:scale-110 transition-transform' : 'bg-surface-container-highest text-outline'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{JOURNEY_ICONS[step.step] ?? 'circle'}</span>
                      </div>
                      <div className="text-center">
                        <p className={`font-extrabold ${step.complete ? 'text-primary' : 'text-outline'}`}>{step.step}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-1">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Financial Breakdown */}
          <h3 className="font-headline text-2xl font-bold text-primary mb-6">Financial Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-[220px]">
              <div>
                <span className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2 block">Total Billed</span>
                <p className="font-headline text-4xl font-extrabold text-primary">${claim.totalBilled.toFixed(2)}</p>
              </div>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Original amount charged by the healthcare provider.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-[220px]">
              <div>
                <span className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2 block">Plan Discount</span>
                <p className="font-headline text-4xl font-extrabold text-primary">-${claim.planDiscount.toFixed(2)}</p>
              </div>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Savings negotiated through your Medicare Arc network.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-[220px]">
              <div>
                <span className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2 block">Insurance Paid</span>
                <p className="font-headline text-4xl font-extrabold text-secondary">${claim.insurancePaid.toFixed(2)}</p>
              </div>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">The portion covered by your primary insurance plan.</p>
            </div>

            <div className="bg-primary text-white p-8 rounded-3xl shadow-lg flex flex-col justify-between h-[220px] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[11px] font-bold text-primary-fixed uppercase tracking-widest mb-2 block">You Owe</span>
                <p className="font-headline text-5xl font-extrabold text-white">${claim.memberResponsibility.toFixed(2)}</p>
              </div>
              <p className="text-sm font-medium text-primary-fixed leading-relaxed relative z-10">This is your final responsibility, often for co-pays or deductibles.</p>
            </div>
          </div>

          {/* Info Modals */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#8c4b14] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                </div>
                <div>
                  <h4 className="font-headline text-xl font-bold mb-2">Did you know?</h4>
                  <p className="text-white/80 leading-relaxed max-w-3xl">Members on your plan save an average of 65% on outpatient services at {claim.provider} by utilizing preferred providers.</p>
                </div>
              </div>
              <button className="bg-white text-[#8c4b14] px-8 py-4 rounded-xl font-bold flex-shrink-0 hover:bg-surface-container transition-colors shadow-sm">View Cost Comparison</button>
            </div>

            <div className="bg-[#001c38] text-white p-10 py-12 rounded-3xl relative overflow-hidden flex items-center">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#ffffff15] to-transparent rounded-l-[100%] scale-150"></div>
              <div className="relative z-10 max-w-lg">
                <h4 className="font-headline text-3xl font-extrabold mb-4 leading-tight">Have questions about this claim?</h4>
                <p className="text-primary-fixed text-lg mb-8 leading-relaxed">Our Care Guides are available 24/7 to walk you through your benefits and financials.</p>
                <button className="flex items-center font-bold text-white hover:text-secondary-container transition-colors">
                  Connect now <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </main>
  );
}
