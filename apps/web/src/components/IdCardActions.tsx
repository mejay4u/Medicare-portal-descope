import { useState, useRef, useEffect } from 'react';
import styles from '../App.module.css';
import flags from '../config/featureFlags';

/* ── Email panel CSS injected once ───────────────────────────── */
const EMAIL_CSS = `
@keyframes _idActionEntry {
  0%   { opacity: 0; transform: translateX(-14px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes _emailPanelSlide {
  0%   { opacity: 0; max-height: 0; transform: translateY(-6px); }
  100% { opacity: 1; max-height: 400px; transform: translateY(0); }
}
._action-email-panel {
  animation: _emailPanelSlide 0.35s cubic-bezier(0.34,1.1,0.64,1) both;
  overflow: hidden;
}

@keyframes _idSpin { to { transform: rotate(360deg); } }
._id-spin { animation: _idSpin 0.7s linear infinite; display: inline-flex; }

@keyframes _idSuccessPop {
  0%   { transform: scale(0.4); opacity: 0; }
  65%  { transform: scale(1.25); }
  100% { transform: scale(1); opacity: 1; }
}
._id-success-pop { animation: _idSuccessPop 0.5s cubic-bezier(0.34,1.4,0.64,1) both; }

._id-email-input {
  width: 100%;
  padding: 11px 40px 11px 38px;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f8fafc;
  color: #191c1d;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
._id-email-input:focus {
  outline: none;
  border-color: #41befd !important;
  box-shadow: 0 0 0 3px rgba(65,190,253,0.18);
}
`;

function injectEmailCSS() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('_id_action_css')) return;
  const el = document.createElement('style');
  el.id = '_id_action_css';
  el.textContent = EMAIL_CSS;
  document.head.appendChild(el);
}
injectEmailCSS();

/* ── Email Panel ─────────────────────────────────────────────── */
type EmailState = 'idle' | 'sending' | 'sent';

function EmailPanel({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<EmailState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    // slight delay so the panel animation finishes before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  function handleSend() {
    if (!isValid || emailState !== 'idle') return;
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
      className="_action-email-panel"
      style={{
        background: 'linear-gradient(145deg, #f0f6ff 0%, #fff 60%)',
        border: '1.5px solid #dbeafe',
        borderRadius: 14,
        padding: '18px 20px',
        boxShadow: '0 6px 24px rgba(0,52,97,0.12)',
      }}
    >
      {emailState === 'sent' ? (
        /* Success */
        <div className="_id-success-pop" style={{ display:'flex', alignItems:'center', gap:14, padding:'4px 0' }}>
          <div style={{
            width:44, height:44, borderRadius:'50%',
            background:'linear-gradient(135deg,#10b981,#059669)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            boxShadow:'0 4px 14px rgba(16,185,129,0.3)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize:24, color:'#fff', fontVariationSettings:"'FILL' 1" }}>check_circle</span>
          </div>
          <div>
            <p style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:14, color:'#064e3b', margin:'0 0 2px' }}>Card Sent!</p>
            <p style={{ fontSize:12, color:'#6b7280', margin:0 }}>Sent to <strong style={{ color:'#064e3b' }}>{email}</strong></p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span className="material-symbols-outlined" style={{ fontSize:18, color:'#003461' }}>forward_to_inbox</span>
              <p style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:13, color:'#003461', margin:0 }}>Email Your ID Card</p>
            </div>
            <button
              onClick={onClose}
              style={{ background:'none', border:'none', cursor:'pointer', padding:2, borderRadius:6, display:'flex', alignItems:'center', color:'#9ca3af', transition:'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#374151')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
            >
              <span className="material-symbols-outlined" style={{ fontSize:18 }}>close</span>
            </button>
          </div>

          <p style={{ fontSize:12, color:'#6b7280', margin:'0 0 12px', lineHeight:1.5 }}>
            A digital copy of your insurance card will be sent to the address below.
          </p>

          {/* Input */}
          <div style={{ position:'relative', marginBottom:10 }}>
            <span className="material-symbols-outlined" style={{
              position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
              fontSize:16, color: isValid ? '#10b981' : '#9ca3af',
              transition:'color 0.2s',
              pointerEvents:'none',
            }}>alternate_email</span>
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="your@email.com"
              className="_id-email-input"
              style={{ border: `1.5px solid ${isValid ? '#10b981' : '#e2e8f0'}` }}
            />
            {isValid && (
              <span className="_id-success-pop material-symbols-outlined" style={{
                position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
                fontSize:16, color:'#10b981', fontVariationSettings:"'FILL' 1",
                pointerEvents:'none',
              }}>check_circle</span>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!isValid || emailState === 'sending'}
            style={{
              width:'100%', padding:'11px 0',
              background: isValid ? 'linear-gradient(135deg,#003461 0%,#00658d 100%)' : '#e2e8f0',
              color: isValid ? '#fff' : '#9ca3af',
              border:'none', borderRadius:10,
              fontWeight:700, fontSize:14,
              fontFamily:'Plus Jakarta Sans,sans-serif',
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition:'background 0.25s, transform 0.1s, box-shadow 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              boxShadow: isValid ? '0 4px 14px rgba(0,52,97,0.28)' : 'none',
            }}
            onMouseEnter={e => { if (isValid) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            {emailState === 'sending' ? (
              <>
                <span className="material-symbols-outlined _id-spin" style={{ fontSize:17 }}>progress_activity</span>
                Sending…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>send</span>
                Send ID Card
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
const BASE_ACTIONS = [
  { icon: 'flip',  label: 'View Back of Card' },
  ...(flags.ID_CARD_EMAIL ? [{ icon: 'mail', label: 'Email ID Card' }] : []),
  { icon: 'style', label: 'Order Physical ID Card' },
];

export default function IdCardActions() {
  const [emailOpen, setEmailOpen] = useState(false);

  function handleAction(label: string) {
    if (label === 'Email ID Card') {
      setEmailOpen(o => !o);
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {BASE_ACTIONS.map(({ icon, label }, i) => (
        <div key={label} style={{ animationDelay:`${i * 0.06}s` }}>
          <button
            className={styles.cardActionBtn}
            onClick={() => handleAction(label)}
            style={label === 'Email ID Card' && emailOpen ? {
              background: '#eff6ff',
              borderColor: '#bfdbfe',
              color: '#1e40af',
            } : undefined}
          >
            <span style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </span>
            <span className="material-symbols-outlined" style={{
              transition:'transform 0.25s',
              transform: label === 'Email ID Card' && emailOpen ? 'rotate(90deg)' : 'none',
            }}>
              chevron_right
            </span>
          </button>

          {/* Email panel drops in right below the Email button */}
          {label === 'Email ID Card' && emailOpen && (
            <div style={{ marginTop: 8 }}>
              <EmailPanel onClose={() => setEmailOpen(false)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
