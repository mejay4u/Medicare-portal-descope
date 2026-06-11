import { useState } from 'react';
import styles from '../App.module.css';
import { colors } from '../theme';

const meters = [
  { label: 'Deductible', value: '$450 / $1,200', pct: 37.5, color: colors.primary },
  { label: 'Out-of-pocket', value: '$1,820 / $4,500', pct: 40.4, color: colors.secondary },
  { label: 'Wellness Credits', value: '85 / 100', pct: 85, color: colors.tertiaryContainer },
];

export default function BenefitSummary() {
  const [activeTab, setActiveTab] = useState<'Medical' | 'Vision' | 'Dental'>('Medical');

  return (
    <div className={styles.benefitCard}>
      <div className={styles.tabBar}>
        {(['Medical', 'Vision', 'Dental'] as const).map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.benefitContent}>
        <div className={styles.benefitHeader}>
          <div>
            <h3 className={styles.benefitTitle}>Benefit Summary</h3>
            <p style={{ color: colors.onSurfaceVariant, fontWeight: 500 }}>Coverage Period: Jan 2024 – Dec 2024</p>
          </div>
          <div className={styles.activeBadge}>
            <span className={styles.activeDot} />
            Active Coverage
          </div>
        </div>
        <div className={styles.metersGrid}>
          {meters.map(({ label, value, pct, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontWeight: 700, color: colors.primary, fontFamily: 'Manrope, sans-serif' }}>{value}</p>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
