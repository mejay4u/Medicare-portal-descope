// import { useUser } from '@descope/react-sdk';
import { useMember, usePlan } from '@medicare/shared';
import styles from '../App.module.css';

export default function MemberIdCard() {
  // const { user } = useUser();
  const { data: member, isLoading: memberLoading } = useMember();
  const { data: plan, isLoading: planLoading } = usePlan();
  const isLoading = memberLoading || planLoading;

  const cardName = member?.name || '—';

  if (isLoading) {
    return (
      <div className={styles.idCard}>
        <div className={styles.idCardDecor} />
        <div className={styles.idCardHeader}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className={styles.skeleton} style={{ height: 12, width: 80 }} />
            <div className={styles.skeleton} style={{ height: 18, width: 140 }} />
          </div>
          <div className={styles.skeleton} style={{ width: 36, height: 36, borderRadius: '50%' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className={styles.skeleton} style={{ height: 28, width: 200 }} />
          <div className={styles.skeleton} style={{ height: 14, width: 160 }} />
        </div>
        <div className={styles.idCardFooter}>
          <div style={{ display: 'flex', gap: 28 }}>
            {[100, 80, 60].map(w => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className={styles.skeleton} style={{ height: 10, width: 40 }} />
                <div className={styles.skeleton} style={{ height: 14, width: w }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.idCard}>
      <div className={styles.idCardDecor} />

      {/* Card Header */}
      <div className={styles.idCardHeader}>
        <div>
          <p className={styles.idCardLabel} style={{ marginBottom: 2 }}>
            {member?.cardLabel ?? 'MEMBER CARD'}
          </p>
          <span className={styles.idCardBrand}>{member?.insurerName ?? 'AmeriHealth'}</span>
        </div>
        <span className="material-symbols-outlined" style={{ fontSize: 36, opacity: 0.7 }}>
          contactless
        </span>
      </div>

      {/* Member Name + ID */}
      <div>
        <h2 className={styles.idCardName}>{cardName}</h2>
        <p className={styles.idCardMemberId}>Member ID: {member?.memberId ?? '—'}</p>
      </div>

      {/* Card Footer */}
      <div className={styles.idCardFooter}>
        <div style={{ display: 'flex', gap: 28 }}>
          <div>
            <p className={styles.idCardLabel}>Plan</p>
            <p className={styles.idCardPlanName}>{plan?.name ?? '—'}</p>
          </div>
          {member?.group && (
            <div>
              <p className={styles.idCardLabel}>Group</p>
              <p className={styles.idCardPlanName}>{member.group}</p>
            </div>
          )}
          {member?.pcn && (
            <div>
              <p className={styles.idCardLabel}>PCN</p>
              <p className={styles.idCardPlanName}>{member.pcn}</p>
            </div>
          )}
        </div>
        <button className={styles.qrBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>qr_code_2</span>
          Show QR
        </button>
      </div>
    </div>
  );
}
