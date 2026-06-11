import React, { useState, useEffect, useRef } from 'react';
import type { MemberData, PlanData } from '@medicare/shared';
import flags from '../config/featureFlags';

/* ── CSS injected once ─────────────────────────────────────── */
const CARD_CSS = `
/* ── Card entrance ── */
@keyframes _cardEntry {
  0%   { opacity: 0; transform: translateY(22px) scale(0.96); }
  60%  { opacity: 1; }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
._card-entry { animation: _cardEntry 0.55s cubic-bezier(0.34,1.28,0.64,1) both; }

._card-scene {
  perspective: 1100px;
  width: 100%;
}
._card-inner {
  position: relative;
  width: 100%;
  height: 320px;
  transform-style: preserve-3d;
  transition: transform 0.72s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
._card-inner._flipped {
  transform: rotateY(180deg);
}
._card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 22px 26px 20px;
  color: #fff;
  box-sizing: border-box;
}
._card-face-front {
  background: linear-gradient(135deg, #003461 0%, #004882 55%, #00658d 100%);
  box-shadow: 0 8px 32px rgba(0,52,97,0.35);
}
._card-face-back {
  background: linear-gradient(145deg, #1a2f4a 0%, #002244 50%, #003461 100%);
  box-shadow: 0 8px 32px rgba(0,30,60,0.4);
  transform: rotateY(180deg);
}

/* ── Flip button ── */
._flip-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(255,255,255,0.14);
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 9px 16px;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.01em;
  transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
  white-space: nowrap;
}
._flip-btn:hover {
  background: rgba(255,255,255,0.26);
  box-shadow: 0 0 0 2px rgba(255,255,255,0.18);
  transform: translateY(-1px);
}
._flip-btn:active { transform: scale(0.95); }

/* ── Secondary card buttons ── */
._card-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255,255,255,0.11);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 9px 0;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.1s;
}
._card-btn:hover { background: rgba(255,255,255,0.22); }
._card-btn:active { transform: scale(0.95); }
._card-btn-active {
  background: rgba(65,190,253,0.28) !important;
  border-color: rgba(65,190,253,0.55) !important;
  box-shadow: 0 0 0 2px rgba(65,190,253,0.2);
}
._card-btn-accent { background: #41befd; border-color: transparent; flex: 1.2; }
._card-btn-accent:hover { background: #60ccff; }

@keyframes _barPulse {
  0%,100% { opacity: 0.5; }
  50%      { opacity: 0.95; }
}
._bar-pulse { animation: _barPulse 2.8s ease-in-out infinite; }

/* ── Email panel ── */
@keyframes _emailSlideDown {
  0%   { opacity: 0; transform: translateY(-10px) scaleY(0.92); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}
._email-panel {
  animation: _emailSlideDown 0.3s cubic-bezier(0.34,1.1,0.64,1) both;
  transform-origin: top center;
}

/* Input focus ring */
._email-input:focus {
  outline: none;
  border-color: #41befd;
  box-shadow: 0 0 0 3px rgba(65,190,253,0.18);
}

/* Send button states */
@keyframes _spin {
  to { transform: rotate(360deg); }
}
._spin { animation: _spin 0.7s linear infinite; }

@keyframes _successPop {
  0%   { transform: scale(0.5); opacity: 0; }
  65%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
._success-pop { animation: _successPop 0.45s cubic-bezier(0.34,1.4,0.64,1) both; }

/* Hover tilt on scene */
._card-scene:hover ._card-inner:not(._flipped) {
  transform: rotateX(1.5deg) rotateY(-1.5deg) translateY(-3px);
  box-shadow: 0 20px 48px rgba(0,52,97,0.32);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
._card-scene:hover ._card-inner._flipped {
  transform: rotateY(180deg) rotateX(1.5deg);
}
`;

function injectCSS() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('_icard_css')) return;
  const el = document.createElement('style');
  el.id = '_icard_css';
  el.textContent = CARD_CSS;
  document.head.appendChild(el);
}
injectCSS();

/* ── Mini barcode ────────────────────────────────────────────── */
function Barcode({ memberId }: { memberId: string }) {
  const pattern = [3,1,2,1,3,2,1,4,1,2,3,1,2,1,3,1,2,2,3,1,2,3,1,2,1,3,2,1];
  let cx = 4;
  const bars: React.ReactElement[] = [];
  pattern.forEach((w, i) => {
    if (i % 2 === 0) bars.push(<rect key={i} x={cx} y={0} width={w * 4.2} height={36} fill="white" opacity={0.8} rx={0.5} />);
    cx += w * 4.2 + 2;
  });
  return (
    <div className="_bar-pulse" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <svg viewBox={`0 0 ${cx} 36`} width="100%" height="30" preserveAspectRatio="none">{bars}</svg>
      <span style={{ fontSize:8, fontFamily:'monospace', opacity:0.5, letterSpacing:'0.2em' }}>
        {memberId.replace(/\s/g,'').match(/.{1,4}/g)?.join(' ')}
      </span>
    </div>
  );
}

/* ── Email panel ─────────────────────────────────────────────── */
type EmailState = 'idle' | 'sending' | 'sent';

function EmailPanel({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<EmailState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSend() {
    if (!isValidEmail || emailState !== 'idle') return;
    setEmailState('sending');
    setTimeout(() => {
      setEmailState('sent');
      setTimeout(() => {
        onClose();
        setEmailState('idle');
        setEmail('');
      }, 2400);
    }, 1500);
  }

  return (
    <div
      className="_email-panel"
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: '0 8px 32px rgba(0,52,97,0.16), 0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e2eaf4',
      }}
    >
      {emailState === 'sent' ? (
        /* ── Success state ── */
        <div className="_success-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#fff', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 15, color: '#064e3b', margin: '0 0 3px' }}>Card Sent!</p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Your ID card was sent to <strong>{email}</strong></p>
          </div>
        </div>
      ) : (
        /* ── Input state ── */
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#003461' }}>mail</span>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 14, color: '#003461', margin: 0 }}>Email Your ID Card</p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex', alignItems: 'center', borderRadius: 6, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#374151')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.5 }}>
            Enter your email address to receive a digital copy of your insurance card.
          </p>

          {/* Input row */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 17, color: isValidEmail ? '#10b981' : '#9ca3af',
              transition: 'color 0.2s',
            }}>
              alternate_email
            </span>
            <input
              ref={inputRef}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="_email-input"
              style={{
                width: '100%',
                padding: '11px 40px 11px 38px',
                border: `1.5px solid ${isValidEmail ? '#10b981' : '#e2e8f0'}`,
                borderRadius: 10,
                fontSize: 14,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                background: '#f8fafc',
                color: '#191c1d',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            {/* Valid checkmark */}
            {isValidEmail && (
              <span className="_success-pop material-symbols-outlined" style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 17, color: '#10b981', fontVariationSettings: "'FILL' 1",
              }}>
                check_circle
              </span>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!isValidEmail || emailState === 'sending'}
            style={{
              width: '100%',
              padding: '12px 0',
              background: isValidEmail ? 'linear-gradient(135deg, #003461 0%, #00658d 100%)' : '#e2e8f0',
              color: isValidEmail ? '#fff' : '#9ca3af',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              cursor: isValidEmail ? 'pointer' : 'not-allowed',
              transition: 'background 0.25s, transform 0.1s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: isValidEmail ? '0 4px 14px rgba(0,52,97,0.28)' : 'none',
            }}
            onMouseEnter={e => { if (isValidEmail) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            onMouseDown={e => { if (isValidEmail) e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {emailState === 'sending' ? (
              <>
                <span className="material-symbols-outlined _spin" style={{ fontSize: 18 }}>progress_activity</span>
                Sending…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>send</span>
                Send ID Card
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */
interface Props {
  member: MemberData;
  plan: PlanData | undefined;
  isLoading: boolean;
}

export default function InsuranceCard({ member, plan, isLoading }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="_card-scene">
        <div style={{
          height: 320, borderRadius: 20,
          background: 'linear-gradient(90deg,#c8d5e3 25%,#d8e4ef 50%,#c8d5e3 75%)',
          backgroundSize: '600px 100%',
          animation: '_shimmer 1.4s ease-in-out infinite',
        }}/>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 3-D card */}
      <div className="_card-scene _card-entry">
        <div className={`_card-inner${flipped ? ' _flipped' : ''}`}>

          {/* ══════════════ FRONT ══════════════ */}
          <div className="_card-face _card-face-front">
            {/* decorative circles */}
            <div style={{ position:'absolute', top:-60, right:-60, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', bottom:-30, left:-30, width:140, height:140, borderRadius:'50%', background:'rgba(65,190,253,0.06)', pointerEvents:'none' }}/>

            {/* header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', flexShrink:0 }}>
              <div>
                <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', opacity:0.6, marginBottom:4 }}>
                  Insurance Member Card
                </div>
                <div style={{ fontFamily:'Manrope,sans-serif', fontSize:15, fontWeight:800, letterSpacing:'0.02em' }}>
                  {member.insurerName} Sanctuary
                </div>
              </div>
              <div style={{ width:28, height:28, background:'rgba(255,255,255,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span className="material-symbols-outlined" style={{ fontSize:15, color:'#fff', fontVariationSettings:"'FILL' 1" }}>verified</span>
              </div>
            </div>

            {/* member name */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative' }}>
              <h2 style={{ fontFamily:'Manrope,sans-serif', fontSize:26, fontWeight:800, margin:'0 0 12px', letterSpacing:'-0.01em' }}>
                {member.name}
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {[
                  { label:'GROUP #', value: member.group },
                  { label:'MBR ID',  value: member.memberId.replace(/\s/g,'').slice(0,7) },
                  { label:'PCN',     value: member.pcn },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', opacity:0.55, marginBottom:2 }}>{label}</div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* button row */}
            <div style={{ display:'flex', gap:8, flexShrink:0, position:'relative' }}>
              <button className="_flip-btn" onClick={() => setFlipped(true)}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>flip</span>
                View Back
              </button>
              {flags.ID_CARD_EMAIL && (
                <button
                  className={`_card-btn${emailOpen ? ' _card-btn-active' : ''}`}
                  onClick={() => { setEmailOpen(o => !o); setFlipped(false); }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize:13 }}>mail</span>
                  Email
                </button>
              )}
              <button className="_card-btn _card-btn-accent">Order Card</button>
            </div>
          </div>

          {/* ══════════════ BACK ══════════════ */}
          <div className="_card-face _card-face-back">
            <div style={{ position:'absolute', top:-50, left:-50, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', bottom:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(65,190,253,0.05)', pointerEvents:'none' }}/>

            {/* Magnetic stripe */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:32, background:'#07111c' }}/>

            <div style={{ marginTop:38, display:'flex', flexDirection:'column', flex:1, gap:10, position:'relative' }}>
              {/* Signature strip */}
              <div style={{
                background:'repeating-linear-gradient(90deg,#ddd 0,#ddd 5px,#f5f5f5 5px,#f5f5f5 10px)',
                borderRadius:6, padding:'7px 12px',
                display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0,
              }}>
                <span style={{ fontFamily:'Georgia,serif', fontSize:15, fontStyle:'italic', color:'#111', letterSpacing:'0.03em' }}>
                  {member.name}
                </span>
                <span style={{ background:'#003461', color:'#fff', fontSize:8, fontWeight:800, padding:'2px 7px', borderRadius:4, letterSpacing:'0.1em' }}>
                  AUTHORIZED
                </span>
              </div>

              {/* Copay pills */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, flexShrink:0 }}>
                {(plan?.copays ?? []).slice(0,4).map(c => (
                  <div key={c.type} style={{
                    background:'rgba(255,255,255,0.07)',
                    borderLeft:'2px solid rgba(65,190,253,0.45)',
                    borderRadius:7, padding:'6px 10px',
                  }}>
                    <div style={{ fontSize:7.5, opacity:0.55, textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700, marginBottom:1 }}>{c.type}</div>
                    <div style={{ fontWeight:800, fontSize:12 }}>{c.amount}</div>
                  </div>
                ))}
              </div>

              {/* Barcode */}
              <div style={{ flex:1, display:'flex', alignItems:'center' }}>
                <Barcode memberId={member.memberId} />
              </div>

              {/* Bottom action row */}
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                <div style={{
                  flex:1, display:'flex', alignItems:'center', gap:7,
                  background:'rgba(255,255,255,0.07)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:10, padding:'8px 12px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14, opacity:0.7 }}>call</span>
                  <div>
                    <div style={{ fontSize:7.5, opacity:0.5, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:1 }}>Member Services</div>
                    <div style={{ fontSize:11.5, fontWeight:700 }}>1-800-555-1234</div>
                  </div>
                </div>
                <button className="_flip-btn" onClick={() => setFlipped(false)}>
                  <span className="material-symbols-outlined" style={{ fontSize:14 }}>flip</span>
                  View Front
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email panel — slides in below the card */}
      {flags.ID_CARD_EMAIL && emailOpen && (
        <EmailPanel onClose={() => setEmailOpen(false)} />
      )}
    </div>
  );
}
