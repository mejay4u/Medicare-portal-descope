/* ── Skeleton shimmer keyframe (injected once via a style tag) ── */
const SHIMMER_CSS = `
@keyframes _shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
._skel {
  background: linear-gradient(90deg, #e8eaed 25%, #f3f4f6 50%, #e8eaed 75%);
  background-size: 600px 100%;
  animation: _shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes _fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
._fadeUp { animation: _fadeUp 0.45s ease both; }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('_dash_styles')) return;
  const s = document.createElement('style');
  s.id = '_dash_styles';
  s.textContent = SHIMMER_CSS;
  document.head.appendChild(s);
}
injectStyles();

/* ── Types ── */
import { useState } from 'react';
import InsuranceCard from '../components/InsuranceCard';
import {
  useMember,
  usePlan,
  useQuickActions,
  useRecentActivity,
  useBenefits,
} from '@medicare/shared';
import type { QuickAction, ActivityItem, CostItem } from '@medicare/shared';

/* ── Skeleton primitives ── */
function Bone({ w, h, r = 6, style = {} }: { w: string | number; h: number; r?: number; style?: React.CSSProperties }) {
  return <div className="_skel" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />;
}

/* ── Icon map: mock server uses material-icon-like ids, map to material-symbols ── */
const ICON_MAP: Record<string, string> = {
  'medical-bag':           'medical_services',
  'pill':                  'medication',
  'file-document-outline': 'receipt_long',
  'help-circle-outline':   'help',
  'search':                'search',
  'local_pharmacy':        'local_pharmacy',
  'payments':              'payments',
  'map':                   'map',
  'chat':                  'chat',
  'settings':              'settings',
};

const ACTIVITY_ICON_MAP: Record<string, { icon: string; color: string; tagText: string; tagBg: string }> = {
  claim:       { icon: 'receipt_long',  color: '#003461', tagText: '#065f46', tagBg: '#d1fae5' },
  appointment: { icon: 'calendar_month', color: '#00658d', tagText: '#0c4a6e', tagBg: '#e0f2fe' },
  referral:    { icon: 'person_check',  color: '#572500', tagText: '#9a3412', tagBg: '#fff7ed' },
  newsletter:  { icon: 'mail',          color: '#424750', tagText: '#475569', tagBg: '#f1f5f9' },
};

/* ── Time-aware greeting ────────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

/* ─────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [benefitTab, setBenefitTab] = useState<'Medical' | 'Vision' | 'Dental'>('Medical');
  const [alertMinimized, setAlertMinimized] = useState(false);

  const { data: member, isLoading: memberLoading } = useMember();
  const { data: plan,   isLoading: planLoading   } = usePlan();
  const { data: qas,   isLoading: qasLoading     } = useQuickActions();
  const { data: acts,  isLoading: actsLoading    } = useRecentActivity();
  const { data: bens,  isLoading: bensLoading    } = useBenefits();

  const isLoading = memberLoading || planLoading || qasLoading || actsLoading || bensLoading;

  return (
    <div style={{ background: '#f5f6f8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 80px', boxSizing: 'border-box' }}>

        {/* ── Welcome Banner ── */}
        <div
          className={!memberLoading ? '_fadeUp' : ''}
          style={{
            background: 'linear-gradient(110deg, #003461 0%, #004882 45%, #00658d 100%)',
            borderRadius: 20,
            padding: '28px 36px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,52,97,0.22)',
          }}
        >
          {/* decorative rings */}
          <div style={{ position:'absolute', right:-80, top:-80, width:280, height:280, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.06)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', right:60, top:-100, width:240, height:240, borderRadius:'50%', background:'rgba(65,190,253,0.07)', pointerEvents:'none' }}/>

          {/* text */}
          <div style={{ position:'relative' }}>
            {memberLoading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <Bone w={160} h={14} r={6} />
                <Bone w={280} h={32} r={8} />
                <Bone w={200} h={12} r={6} />
              </div>
            ) : (
              <>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)', marginBottom:6 }}>
                  {getTodayLabel()}
                </div>
                <h1 style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#fff',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}>
                  {getGreeting()}, {member!.name.split(' ')[0]}! 👋
                </h1>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, fontWeight:500, margin:0 }}>
                  Here's a summary of your health coverage and recent activity.
                </p>
              </>
            )}
          </div>

          {/* right-side pill stats */}
          {!memberLoading && (
            <div style={{ display:'flex', gap:12, flexShrink:0, position:'relative' }}>
              {[
                { icon:'verified_user', label:'Plan Active',    value: plan?.name?.split(' ').slice(-1)[0] ?? 'Active' },
                { icon:'calendar_month', label:'Coverage Thru', value: plan?.coverageThrough ?? 'Dec 2024' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background:'rgba(255,255,255,0.1)',
                  border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:14,
                  padding:'12px 18px',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                  minWidth:110, textAlign:'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize:20, color:'#41befd', fontVariationSettings:"'FILL' 1" }}>{icon}</span>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Row 1: Member Card + Insurance ID Card ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 20, marginBottom: 28 }}>

          {/* Welcome Card */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: '32px 28px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }} className={!isLoading ? '_fadeUp' : ''}>
            {memberLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Bone w={80} h={18} r={20} />
                <Bone w="70%" h={36} />
                <Bone w="50%" h={14} />
                <Bone w="100%" h={56} r={12} style={{ marginTop: 12 }} />
              </div>
            ) : (
              <>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#00658d', background: '#e0f2fe', padding: '4px 10px', borderRadius: 20,
                  }}>Active Member</span>
                  <h1 style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: 32, fontWeight: 800,
                    color: '#003461', margin: '14px 0 4px', letterSpacing: '-0.02em',
                  }}>{member!.name}</h1>
                  <p style={{ color: '#727781', fontSize: 14, fontWeight: 500, margin: '0 0 20px' }}>
                    Member ID: {member!.memberId}
                  </p>
                </div>
                <div style={{
                  background: '#f0f6ff', borderRadius: 12, padding: '14px 18px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <span style={{ color: '#1e40af', fontWeight: 700, fontSize: 15 }}>{plan ? plan.name : 'AmeriHealth Premier Choice'}</span>
                  <span style={{ color: '#727781', fontSize: 12 }}>Medicare Advantage HMO</span>
                </div>
              </>
            )}
          </div>

          {/* Insurance ID Card — 3-D flip */}
          <div className={!isLoading ? '_fadeUp' : ''} style={{ animationDelay: '0.06s' }}>
            <InsuranceCard
              member={member!}
              plan={plan}
              isLoading={memberLoading || planLoading}
            />
          </div>
        </div>

        {/* ── Row 2: Action Required ── */}
        <section style={{ marginBottom: 28 }} className={!isLoading ? '_fadeUp' : ''}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: alertMinimized ? 0 : 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 700, color: '#191c1d', margin: 0 }}>Action Required</h2>
              <span style={{
                background: '#ba1a1a', color: '#fff', borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>2</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a href="#" style={{
                fontSize: 13, fontWeight: 700, color: '#003461', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 12px', borderRadius: 8, background: '#eff6ff',
                transition: 'background 0.18s',
              }}
                className="hover:bg-blue-100 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#003461' }}>notifications</span>
                View All Notifications
              </a>
              <button
                onClick={() => setAlertMinimized(v => !v)}
                title={alertMinimized ? 'Expand' : 'Minimize'}
                className="hover:bg-slate-100 transition-colors"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 8,
                  padding: '6px 10px', cursor: 'pointer', color: '#424750',
                  fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: 18,
                  transition: 'transform 0.25s',
                  transform: alertMinimized ? 'rotate(-90deg)' : 'rotate(0deg)',
                }}>
                  expand_less
                </span>
                {alertMinimized ? 'Show' : 'Hide'}
              </button>
            </div>
          </div>

          {/* Collapsible body */}
          <div style={{
            overflow: 'hidden',
            maxHeight: alertMinimized ? 0 : 400,
            opacity: alertMinimized ? 0 : 1,
            transition: 'max-height 0.35s ease, opacity 0.25s ease',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {planLoading ? (
                [0, 1].map(i => <Bone key={i} w="100%" h={120} r={16} />)
              ) : (
                [
                  { icon: 'medical_services', iconBg: '#572500', title: 'Annual Wellness Visit Overdue', body: 'Your free annual physical is now due. Staying proactive is the key to maintaining your sanctuary of health.', cta: 'Schedule Visit', ctaBg: '#572500', border: '#572500' },
                  { icon: 'person',           iconBg: '#003461', title: 'Update Primary Contact',       body: 'Please confirm your current mailing address to ensure your new member benefits package arrives safely.',   cta: 'Review Details', ctaBg: '#003461', border: '#003461' },
                ].map(a => (
                  <div key={a.title} style={{
                    background: '#fff', borderRadius: 16, padding: '20px 20px 20px 16px',
                    borderLeft: `4px solid ${a.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: a.iconBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 15, color: '#191c1d', marginBottom: 5 }}>{a.title}</div>
                        <div style={{ fontSize: 13, color: '#727781', lineHeight: 1.5 }}>{a.body}</div>
                      </div>
                    </div>
                    <button style={{ alignSelf: 'flex-start', background: a.ctaBg, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {a.cta}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Row 3: Quick Actions ── */}
        <section style={{ marginBottom: 28 }} className={!isLoading ? '_fadeUp' : ''}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 700, color: '#191c1d', margin: '0 0 16px' }}>Quick Actions</h2>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '24px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          }}>
            {qasLoading || !qas ? (
              [0,1,2,3,4,5].map(i => <Bone key={i} w={70} h={80} r={14} />)
            ) : (
              qas.map((action: QuickAction, i: number) => {
                const isLast = i === qas.length - 1;
                const matIcon = ICON_MAP[action.icon] ?? action.icon;
                return (
                  <button key={action.id} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: isLast ? '#003461' : '#f5f6f8',
                    border: 'none', borderRadius: isLast ? '50%' : 14,
                    padding: isLast ? '16px' : '16px 22px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    width: isLast ? 56 : undefined, height: isLast ? 56 : undefined,
                    boxShadow: isLast ? '0 4px 12px rgba(0,52,97,0.3)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                    className="hover:-translate-y-0.5 transition-transform"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: isLast ? '#fff' : '#003461' }}>{matIcon}</span>
                    {!isLast && <span style={{ fontSize: 12, fontWeight: 600, color: '#424750', whiteSpace: 'nowrap' }}>{action.label}</span>}
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ── Row 4: PCP + Benefits  |  Recent Activity ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* PCP Card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              className={!isLoading ? '_fadeUp' : ''}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: 20 }}>
                Primary Care Provider
              </span>
              {memberLoading ? (
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 16 }}>
                  <Bone w={80} h={80} r={40} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Bone w="60%" h={22} />
                    <Bone w="40%" h={14} />
                    <Bone w="80%" h={12} />
                    <Bone w="120" h={40} r={10} style={{ marginTop: 8 }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 14 }}>
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr. Sarah Jenkins"
                    style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid #d3e4ff' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 700, color: '#003461', margin: '0 0 4px' }}>Dr. Sarah Jenkins</h3>
                    <p style={{ fontSize: 13, color: '#00658d', fontWeight: 600, margin: '0 0 12px' }}>Internal Medicine Specialist</p>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#727781' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#003461' }}>location_on</span>1200 Sanctuary Plaza, Suite 400
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#727781' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#003461' }}>call</span>(555) 234-8900
                      </span>
                    </div>
                    <button style={{ marginTop: 16, background: '#003461', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                      Schedule Appointment <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Benefit Summary Card */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}
              className={!isLoading ? '_fadeUp' : ''}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 16px' }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: '#003461', margin: 0 }}>Benefit Summary</h2>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['Medical', 'Vision', 'Dental'] as const).map(tab => (
                    <button key={tab} onClick={() => setBenefitTab(tab)} style={{
                      background: benefitTab === tab ? '#003461' : '#f1f5f9',
                      color: benefitTab === tab ? '#fff' : '#475569',
                      border: 'none', borderRadius: 8, padding: '6px 14px',
                      fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
                    }}>{tab}</button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {bensLoading || !bens ? (
                  <>
                    <Bone w="100%" h={72} r={8} />
                    <Bone w="100%" h={72} r={8} />
                    <Bone w="100%" h={72} r={12} />
                  </>
                ) : (
                  <>
                    {bens.costs.map((c: CostItem) => {
                      const pct = Math.round((c.spent / c.total) * 100);
                      return (
                        <div key={c.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#727781' }}>{c.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#003461' }}>{pct}% Used</span>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 800, color: '#003461' }}>
                              ${c.spent.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 500, color: '#727781' }}>/ ${c.total.toLocaleString()}</span>
                            </span>
                          </div>
                          <div style={{ background: '#e2e8f0', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#003461', borderRadius: 99, transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: 12, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#065f46', marginBottom: 4 }}>Wellness Credits Earned</div>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 28, fontWeight: 800, color: '#064e3b' }}>$125.00</span>
                      </div>
                      <button style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Redeem Credits
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right column — Recent Activity */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}
            className={!isLoading ? '_fadeUp' : ''}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: '#003461', margin: '0 0 18px' }}>Recent Activity</h2>

            {actsLoading || !acts ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <Bone w={38} h={38} r={19} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Bone w="80%" h={14} />
                      <Bone w="55%" h={11} />
                      <Bone w={80} h={20} r={6} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                {acts.map((item: ActivityItem) => {
                  const meta = ACTIVITY_ICON_MAP[item.type] ?? ACTIVITY_ICON_MAP.newsletter;
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: meta.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 19, color: meta.color, fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: '#191c1d', marginBottom: 2 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: '#727781', marginBottom: 6 }}>{item.subtitle} • {item.date}</div>
                        {item.detail && (
                          <span style={{ display: 'inline-block', background: meta.tagBg, color: meta.tagText, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6 }}>
                            {item.detail}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button style={{ marginTop: 20, background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 0', color: '#003461', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
              View All Activity
            </button>
          </div>
        </div>
      </main>

      <footer style={{ background: '#f0f2f5', borderTop: '1px solid #e2e8f0', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 15, color: '#003461' }}>Medicare Sanctuary</span>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Contact Us'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#727781', textDecoration: 'none', fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#c2c6d1' }}>© 2024 AmeriHealth Sanctuary</span>
        </div>
      </footer>
    </div>
  );
}
