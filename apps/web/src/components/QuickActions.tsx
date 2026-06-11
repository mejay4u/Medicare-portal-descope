import { useQuickActions } from '@medicare/shared';
import { NavLink } from 'react-router-dom';
import styles from '../App.module.css';
import { colors } from '../theme';

const ICON_MAP: Record<string, string> = {
  'medical-bag': 'medical_information',
  'pill': 'medication',
  'file-document-outline': 'request_quote',
  'help-circle-outline': 'support_agent',
};

const ROUTE_MAP: Record<string, string> = {
  'find-doctor': '/find-care',
  'refill-rx': '/prescriptions',
  'view-claims': '/claims',
  'help-center': '/benefits',
};

export default function QuickActions() {
  const { data: actions = [], isLoading } = useQuickActions();

  return (
    <div className={styles.quickActionsCard}>
      <h3 className={styles.sectionHeading}>Quick Actions</h3>
      <div className={styles.quickActionsGrid}>
        {isLoading && [0,1,2,3].map(i => (
          <div key={i} className={styles.quickActionItem} style={{ pointerEvents: 'none' }}>
            <div className={styles.skeleton} style={{ width: 36, height: 36, borderRadius: 8, marginBottom: 8 }} />
            <div className={styles.skeleton} style={{ height: 12, width: 60, borderRadius: 4 }} />
          </div>
        ))}
        {actions.map(({ id, icon, label }) => (
          <NavLink key={id} to={ROUTE_MAP[id] ?? '/'} className={styles.quickActionItem} style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: colors.secondary, marginBottom: 8 }}>
              {ICON_MAP[icon] ?? icon}
            </span>
            <span style={{ fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
