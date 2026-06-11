import { useActionAlert } from '@medicare/shared';
import styles from '../App.module.css';

const ICON_MAP: Record<string, string> = {
  'bell': 'notifications',
  'priority_high': 'priority_high',
};

interface ActionAlertBannerProps {
  onDismiss: () => void;
}

export default function ActionAlertBanner({ onDismiss }: ActionAlertBannerProps) {
  const { data, isLoading } = useActionAlert();

  if (isLoading) {
    return (
      <section className={styles.alertBanner}>
        <div className={styles.alertContent}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
            <div className={styles.skeleton} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              <div className={styles.skeleton} style={{ height: 18, width: 240 }} />
              <div className={styles.skeleton} style={{ height: 14, width: '70%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className={styles.skeleton} style={{ height: 38, width: 110, borderRadius: 8 }} />
            <div className={styles.skeleton} style={{ height: 38, width: 80, borderRadius: 8 }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.alertBanner}>
      <div className={styles.alertContent}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div className={styles.alertIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{ICON_MAP[data?.icon ?? ''] ?? 'priority_high'}</span>
          </div>
          <div>
            <h2 className={styles.alertTitle}>{data?.title ?? 'Action Required'}</h2>
            <p className={styles.alertItem}>
              <span className={styles.alertDot} />
              {data?.body ?? ''}
            </p>
          </div>
        </div>
        <div className={styles.alertActions}>
          <button className={styles.alertPrimaryBtn}>Review Now</button>
          <button className={styles.alertSecondaryBtn} onClick={onDismiss}>Dismiss</button>
        </div>
      </div>
    </section>
  );
}
