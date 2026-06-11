import type { ReactElement } from 'react';

export const SPECIALTY_THEME: Record<string, [string, string, string]> = {
  'Primary Care':      ['#003461', '#1D6FA4', 'stethoscope'],
  'Family Medicine':   ['#003461', '#1D6FA4', 'stethoscope'],
  'Cardiology':        ['#7F1D1D', '#C0392B', 'cardiology'],
  'Internal Medicine': ['#065F46', '#0D9B6A', 'medical_information'],
  'Physical Therapy':  ['#713F12', '#C67A1D', 'self_improvement'],
  'Dermatology':       ['#4C1D95', '#7C3AED', 'dermatology'],
  'Orthopedics':       ['#0C4A6E', '#0284C7', 'orthopedics'],
  'Neurology':         ['#1E1B4B', '#4338CA', 'neurology'],
  'Gastroenterology':  ['#134E4A', '#0F9488', 'biotech'],
  'Psychiatry':        ['#831843', '#BE185D', 'psychology'],
  'Ophthalmology':     ['#164E63', '#0891B2', 'visibility'],
};

export const FALLBACK_THEME: [string, string, string] = ['#1E3A5F', '#2563EB', 'medical_services'];

interface DoctorAvatarProps {
  name: string;
  category: string;
  providerId: string;
  size?: number;
  dimmed?: boolean;
}

export function DoctorAvatar({
  name, category, providerId, size = 160, dimmed = false,
}: DoctorAvatarProps): ReactElement {
  const cleanName = name.replace(/^Dr\.?\s+/i, '');
  const parts = cleanName.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  const [g1, g2, icon] = SPECIALTY_THEME[category] ?? FALLBACK_THEME;
  const gradId = `avgrad-${providerId}`;

  return (
    <div style={{
      position: 'relative', width: size, height: size, borderRadius: 16, overflow: 'hidden', flexShrink: 0,
      filter: dimmed ? 'grayscale(0.5) opacity(0.75)' : 'none',
      boxShadow: dimmed ? 'none' : '0 8px 28px rgba(0,52,97,0.22)',
    }}>
      <svg width={size} height={size} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={g1} />
            <stop offset="100%" stopColor={g2} />
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill={`url(#${gradId})`} />
        <circle cx="138" cy="22"  r="48" fill="rgba(255,255,255,0.07)" />
        <circle cx="22"  cy="140" r="40" fill="rgba(255,255,255,0.05)" />
        <path d="M0 160 L0 114 Q0 96 20 90 L56 77 L80 97 L104 77 L140 90 Q160 96 160 114 L160 160 Z"
          fill="rgba(255,255,255,0.15)" />
        <path d="M56 77 L80 100 L104 77 L110 81 L80 118 L50 81 Z" fill="rgba(255,255,255,0.22)" />
        <ellipse cx="80" cy="52" rx="27" ry="30" fill="rgba(255,255,255,0.18)" />
        <text x="80" y="60" dominantBaseline="central" textAnchor="middle"
          fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="32" fill="white" opacity="0.95" letterSpacing="-1">
          {initials}
        </text>
      </svg>
      <div style={{
        position: 'absolute', bottom: 10, right: 10, width: 32, height: 32,
        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
        borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-symbols-outlined"
          style={{ fontSize: 18, color: 'white', fontVariationSettings: "'FILL' 1, 'wght' 300" }}>
          {icon}
        </span>
      </div>
    </div>
  );
}
