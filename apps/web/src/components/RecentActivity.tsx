import { useRecentActivity } from '@medicare/shared';
import styles from '../App.module.css';
import { colors } from '../theme';

const ICON_MAP: Record<string, string> = {
  'check-circle': 'check_circle',
  'calendar-clock': 'event_available',
};

export default function RecentActivity() {
  const { data: items = [], isLoading } = useRecentActivity();

  return (
    <div className={styles.activityCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 className={styles.sectionHeading}>Recent Activity</h3>
        <button style={{ color: colors.secondary, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>View All</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isLoading && [0,1,2].map(i => (
          <div key={i} className={styles.activityItem}>
            <div className={styles.skeleton} style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className={styles.skeleton} style={{ height: 14, width: '60%' }} />
              <div className={styles.skeleton} style={{ height: 12, width: '45%' }} />
            </div>
            <div className={styles.skeleton} style={{ height: 12, width: 50 }} />
          </div>
        ))}
        {items.map(item => (
          <div key={item.id} className={styles.activityItem}>
            <div className={styles.activityIconWrap} style={{ background: `${item.statusColor}1a`, color: item.statusColor }}>
              <span className="material-symbols-outlined">{ICON_MAP[item.statusIcon] ?? item.statusIcon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{item.title}</p>
              <p style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{item.subtitle}</p>
              {item.detail && <p style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface }}>{item.detail}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: colors.onSurfaceVariant }}>{item.dateLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
