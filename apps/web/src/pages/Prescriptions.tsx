import { useMember, usePlan, usePrescriptions } from '@medicare/shared';
import styles from '../App.module.css';

const FOOTER_LINKS = ['Privacy Policy', 'Terms of Use', 'Accessibility Services', 'Language Support', 'Contact Us'];

export default function Prescriptions() {
  const { data: member } = useMember();
  const { data: plan } = usePlan();
  const { data: rx } = usePrescriptions();

  const morningMeds  = rx?.morning  ?? [];
  const eveningMeds  = rx?.evening  ?? [];
  const activePrescriptions = rx?.active ?? [];

  return (
    <>
      <main className={styles.pageWrap}>
        <header className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <h1 className="font-headline text-6xl font-extrabold text-primary tracking-tight mb-4">Your Wellness, Simplified.</h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              {member?.name ? `Managing ${member.name.split(' ')[0]}'s` : 'Manage your'} daily medications and refills with complete clarity.
              Our concierge is here to help if you have any questions.
            </p>
          </div>
          <div className="md:col-span-5 flex justify-end">
            <div className="bg-secondary-container/10 p-8 rounded-xl border border-secondary-container/20 max-w-sm" style={{ borderTopRightRadius: '4rem' }}>
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                <h3 className="font-headline font-bold text-primary text-xl">All Clear</h3>
              </div>
              <p className="text-on-surface-variant text-lg">No interactions detected between your current prescriptions.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Left Column */}
          <div className="md:col-span-8 space-y-12">

            {/* Daily Schedule */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline text-3xl font-bold text-primary">Daily Schedule</h2>
                <span className="text-on-surface-variant font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-8 rounded-2xl border-l-8 border-secondary" style={{ boxShadow: '0 4px 20px rgba(0,52,97,0.10)' }}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-secondary font-bold text-sm tracking-widest uppercase">Morning</span>
                      <h3 className="text-4xl font-headline font-extrabold text-primary mt-1">8:00 AM</h3>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-5xl">light_mode</span>
                  </div>
                  <ul className="space-y-4">
                    {morningMeds.map(med => (
                      <li key={med.name} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                        <span className="text-xl font-bold text-on-surface">{med.name}</span>
                        <span className="text-on-surface-variant font-medium text-lg">{med.dose}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-4 bg-secondary text-white rounded-lg font-bold text-lg hover:bg-primary transition-colors">
                    Mark All Taken
                  </button>
                </div>

                <div className="bg-white p-8 rounded-2xl border-l-8 border-primary" style={{ boxShadow: '0 4px 20px rgba(0,52,97,0.10)' }}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-primary font-bold text-sm tracking-widest uppercase">Evening</span>
                      <h3 className="text-4xl font-headline font-extrabold text-primary mt-1">8:00 PM</h3>
                    </div>
                    <span className="material-symbols-outlined text-primary text-5xl">dark_mode</span>
                  </div>
                  <ul className="space-y-4">
                    {eveningMeds.map(med => (
                      <li key={med.name} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                        <span className="text-xl font-bold text-on-surface">{med.name}</span>
                        <span className="text-on-surface-variant font-medium text-lg">{med.dose}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-4 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary hover:text-white transition-colors">
                    Schedule Reminder
                  </button>
                </div>

              </div>
            </section>

            {/* Active Prescriptions */}
            <section>
              <h2 className="font-headline text-3xl font-bold text-primary mb-8">Active Prescriptions</h2>
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,52,97,0.08)', border: '1px solid rgba(0,52,97,0.05)' }}>
                {activePrescriptions.map((rx, i) => (
                  <div key={rx.name}>
                    {i > 0 && <div className="h-px bg-outline-variant/20 mx-8" />}
                    <div className="p-8 hover:bg-white transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-2xl font-extrabold text-primary font-headline tracking-tight">{rx.name} <span className="text-on-surface-variant font-medium text-xl">{rx.dose}</span></h4>
                            {rx.status === 'refill-ready' && (
                              <span className="bg-secondary-container/20 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase">Refill Ready</span>
                            )}
                            {rx.status === 'no-refills' && (
                              <span className="bg-error-container text-error text-xs font-bold px-3 py-1 rounded-full uppercase">No Refills</span>
                            )}
                          </div>
                          <p className="text-lg text-on-surface-variant">{rx.indication} · {rx.doctor}</p>
                          <div className="mt-4 flex gap-6 text-sm font-medium text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">event</span>
                              Last filled {rx.lastFilled}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">medication</span>
                              {rx.refills > 0 ? `${rx.refills} refill${rx.refills !== 1 ? 's' : ''} remaining` : 'No refills remaining'}
                            </span>
                          </div>
                        </div>
                        {rx.status === 'refill-ready' ? (
                          <button className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all">
                            Refill Now
                          </button>
                        ) : (
                          <button className="bg-surface-container-high text-on-surface-variant px-10 py-5 rounded-xl font-bold text-xl">
                            Request Refill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="md:col-span-4 space-y-8">

            {/* Primary Pharmacy */}
            <div className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden" style={{ borderTopRightRadius: '4rem', boxShadow: '0 8px 32px rgba(0,52,97,0.30)' }}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>local_pharmacy</span>
                  <span className="font-bold tracking-widest text-sm uppercase opacity-80">Primary Pharmacy</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">Aura Community Care</h3>
                <p className="text-on-primary-container text-sm mb-1">{plan?.name ?? 'Medicare Advantage Plus'}</p>
                <p className="text-on-primary-container text-lg mb-8 leading-relaxed">
                  500 Wellness Ave<br />San Francisco, CA 94102
                </p>
                <div className="space-y-4">
                  <a className="flex items-center justify-center gap-3 w-full bg-white text-primary py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors" href="tel:5550123">
                    <span className="material-symbols-outlined">call</span>
                    (555) 012-3456
                  </a>
                  <button className="flex items-center justify-center gap-3 w-full bg-primary-container text-white py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-blue-900 transition-colors">
                    <span className="material-symbols-outlined">map</span>
                    Get Directions
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* AI Assistant */}
            <div className="bg-white p-8 rounded-2xl border border-tertiary-container/20" style={{ boxShadow: '0 2px 10px rgba(0,52,97,0.07)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-lg">AI Assistant</h4>
                  <p className="text-sm text-on-surface-variant">Ready to help you</p>
                </div>
              </div>
              <p className="text-on-surface-variant text-lg italic mb-6">
                "I noticed you're due for a Lisinopril refill next week. Would you like me to request it for you?"
              </p>
              <button className="w-full py-4 bg-tertiary-container text-white rounded-xl font-bold text-lg shadow-md hover:bg-tertiary transition-colors">
                Yes, please
              </button>
            </div>

            {/* Delivery Status */}
            <div className="bg-white p-8 rounded-2xl" style={{ boxShadow: '0 2px 10px rgba(0,52,97,0.07)' }}>
              <h4 className="font-headline font-bold text-primary text-xl mb-6">Delivery Status</h4>
              <div className="relative pl-8 border-l-2 border-secondary-container">
                <div className="mb-6 relative">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 bg-secondary rounded-full ring-4 ring-white" />
                  <p className="font-bold text-on-surface">Out for Delivery</p>
                  <p className="text-sm text-on-surface-variant">Arriving by 5:00 PM Today</p>
                </div>
                <div className="relative opacity-40">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 bg-slate-400 rounded-full ring-4 ring-white" />
                  <p className="font-bold text-on-surface">Delivered</p>
                </div>
              </div>
              <div className="mt-8 rounded-xl overflow-hidden h-32 bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-outline text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>local_shipping</span>
              </div>
            </div>

          </div>
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
