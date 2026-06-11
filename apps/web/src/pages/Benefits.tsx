import { useBenefits, useMember } from '@medicare/shared';
import styles from '../App.module.css';

const ICON_MAP: Record<string, string> = {
  'hospital-box-outline': 'local_hospital',
  'tooth-outline': 'dentistry',
  'eye-outline': 'visibility',
  'ear-hearing': 'hearing',
};

const COST_ICONS = ['payments', 'account_balance_wallet'];
const COST_COLORS = ['bg-primary', 'bg-secondary'];
const COST_TEXT_COLORS = ['text-primary', 'text-secondary'];

const FOOTER_LINKS = ['Privacy Policy', 'Terms of Use', 'Accessibility Services', 'Language Support', 'Contact Us'];

export default function Benefits() {
  const { data: benefits, isLoading: benefitsLoading } = useBenefits();
  const { data: member, isLoading: memberLoading } = useMember();
  const isLoading = benefitsLoading || memberLoading;

  const firstName = member?.name?.split(' ')[0] ?? 'there';
  const featuredBenefit = benefits?.breakdown.find(b => b.featured);
  const compactBenefits = benefits?.breakdown.filter(b => !b.featured) ?? [];

  if (isLoading) {
    return (
      <main className={styles.pageWrap}>
        <section className="mb-16">
          <div className={styles.skeleton} style={{ height: 52, width: 320, borderRadius: 10, marginBottom: 16 }} />
          <div className={styles.skeleton} style={{ height: 20, width: 480, borderRadius: 6 }} />
        </section>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <div className={styles.skeleton} style={{ height: 400, borderRadius: 16 }} />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className={styles.skeleton} style={{ height: 400, borderRadius: 16 }} />
          </div>
          <div className="col-span-12 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1].map(i => (
              <div key={i} className={styles.skeleton} style={{ height: 180, borderRadius: 16 }} />
            ))}
          </div>
          <div className="col-span-12 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className={styles.skeleton} style={{ height: 220, borderRadius: 16 }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className={styles.pageWrap}>

        <section className="mb-16">
          <h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-4">
            Hello, {firstName}.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Welcome to your health sanctuary. Everything you need to manage your care and maximize your coverage is curated right here.
          </p>
        </section>

        <div className="grid grid-cols-12 gap-8 items-start">

          {/* Coverage Snapshot */}
          <div
            className="col-span-12 lg:col-span-7 bg-white p-10 flex flex-col justify-between min-h-[400px] border-l-8 border-primary relative overflow-hidden"
            style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem', borderBottomLeftRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,52,97,0.10)' }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Active Member</span>
                <span className="text-on-surface-variant text-sm font-medium">Plan: {benefits?.planName ?? '—'}</span>
              </div>
              <h2 className="font-headline text-3xl font-bold text-primary mb-6">Coverage Snapshot</h2>
              <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                  <p className="text-on-surface-variant text-sm mb-1 uppercase tracking-wider font-semibold">Member Name</p>
                  <p className="text-xl font-bold text-on-surface">{member?.name ?? '—'}</p>
                  {member?.group && <p className="text-sm text-secondary font-medium mt-1">Group: {member.group}</p>}
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm mb-1 uppercase tracking-wider font-semibold">Member ID</p>
                  <p className="text-xl font-bold text-on-surface">{benefits?.memberId ?? member?.memberId ?? '—'}</p>
                  {member?.pcn && <p className="text-sm text-secondary font-medium mt-1">PCN: {member.pcn}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:shadow-md transition-all">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>badge</span>
                View Digital ID
              </button>
              <button className="bg-surface-container-high text-on-surface-variant px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined">print</span>
                Order Replacement Card
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-24 -mt-24 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary-container/10 rounded-full -mr-16 -mb-16 pointer-events-none" />
          </div>

          {/* Wellness Card */}
          {benefits?.wellness && (
            <div className="col-span-12 lg:col-span-5 rounded-xl overflow-hidden min-h-[400px] relative group shadow-sm">
              <img
                src={benefits.wellness.imageUrl}
                alt="Wellness"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
                <h3 className="font-headline text-3xl font-bold text-white mb-3">{benefits.wellness.title}</h3>
                <p className="text-on-primary-container text-lg mb-6 leading-relaxed">{benefits.wellness.body}</p>
                <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold inline-flex items-center gap-3 hover:scale-105 transition-transform">
                  Explore Rewards
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Cost Trackers */}
          <div className="col-span-12 mt-8">
            <div className="mb-10">
              <h2 className="font-headline text-4xl font-extrabold text-primary mb-2">Know Your Costs</h2>
              <p className="text-on-surface-variant">Real-time status of your annual usage and contribution limits.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(benefits?.costs ?? []).map((cost, i) => {
                const pct = Math.round((cost.spent / cost.total) * 100);
                return (
                  <div key={cost.label} className={`bg-white p-8 rounded-2xl flex flex-col ${styles.hoverLift}`} style={{ boxShadow: '0 2px 10px rgba(0,52,97,0.08)' }}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>
                          {COST_ICONS[i] ?? 'payments'}
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-xl text-primary">{cost.label}</h4>
                    </div>
                    <div className="mb-4 flex justify-between items-end">
                      <span className="text-4xl font-extrabold text-on-surface tracking-tight">
                        ${cost.spent.toLocaleString()}
                        <span className="text-lg font-medium text-on-surface-variant"> / ${cost.total.toLocaleString()}</span>
                      </span>
                      <span className={`${COST_TEXT_COLORS[i] ?? 'text-primary'} font-bold text-sm`}>{pct}% Met</span>
                    </div>
                    <div className="w-full h-4 bg-surface-container-highest rounded-full mb-4 overflow-hidden">
                      <div
                        className={`h-full ${COST_COLORS[i] ?? 'bg-primary'} rounded-full transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Benefit */}
          {featuredBenefit && (
            <div className="col-span-12 lg:col-span-8 mt-8">
              <div
                className="bg-white p-10 rounded-2xl border-l-8 border-secondary"
                style={{ borderTopRightRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,52,97,0.10)' }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>
                      {ICON_MAP[featuredBenefit.icon] ?? 'health_and_safety'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-primary">{featuredBenefit.title}</h3>
                    <p className="text-on-surface-variant">{featuredBenefit.subtitle}</p>
                  </div>
                  <span className="ml-auto bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {featuredBenefit.lineItems.map(item => (
                    <div key={item.label} className="bg-surface-container p-4 rounded-xl">
                      <p className="text-sm text-on-surface-variant font-medium mb-1">{item.label}</p>
                      <p className="text-xl font-extrabold text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Coverage Notice */}
          <div className="col-span-12 lg:col-span-4 mt-8">
            <div className="bg-white p-8 rounded-2xl h-full" style={{ boxShadow: '0 2px 10px rgba(0,52,97,0.08)', border: '1px solid #e8edf4' }}>
              <h5 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">info</span>
                Coverage Notice
              </h5>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Your preventive care benefits, such as flu shots and annual wellness visits, are covered at 100% and do not count toward your deductible.
              </p>
              <a className="text-primary font-bold text-sm flex items-center gap-1 group" href="#">
                See All 100% Covered Services
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
              </a>
            </div>
          </div>

          {/* Compact Benefit Cards */}
          {compactBenefits.length > 0 && (
            <div className="col-span-12 mt-4">
              <h3 className="font-headline text-2xl font-bold text-primary mb-6">Additional Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compactBenefits.map(benefit => (
                  <div key={benefit.id} className={`bg-white p-6 rounded-2xl ${styles.hoverLift}`} style={{ boxShadow: '0 2px 8px rgba(0,52,97,0.07)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                          {ICON_MAP[benefit.icon] ?? 'health_and_safety'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{benefit.title}</h4>
                        <p className="text-sm text-on-surface-variant">{benefit.subtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {benefit.lineItems.map(item => (
                        <div key={item.label} className="flex justify-between items-center py-2 border-b border-outline-variant/20 last:border-0">
                          <span className="text-sm text-on-surface-variant">{item.label}</span>
                          <span className="text-sm font-bold text-primary">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="bg-slate-50 w-full py-12 px-24 mt-16" style={{ borderTop: '1px solid #e2e8f0' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-2xl mx-auto items-center">
          <div className="flex flex-col gap-4">
            <div className="font-headline font-bold text-2xl text-slate-800">AmeriHealth Sanctuary</div>
            <p className="font-body text-sm leading-relaxed text-slate-500">© 2024 AmeriHealth Sanctuary. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
            {FOOTER_LINKS.map(link => (
              <a key={link} className="text-slate-500 hover:underline decoration-2 underline-offset-4 transition-opacity font-body text-sm" href="#">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
