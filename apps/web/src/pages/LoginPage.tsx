import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Descope, useSession } from '@descope/react-sdk';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { isAuthenticated } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.brand}>AmeriHealth Sanctuary</span>
        <span className={styles.headerTag}>Secure Member Portal</span>
      </header>

      {/* Body */}
      <div className={styles.body}>
        {/* Left copy panel */}
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Member Portal</span>
          <h1 className={styles.heading}>
            Your health,<br />your way.
          </h1>
          <p className={styles.subtext}>
            Sign in to access your Medicare Advantage benefits, review claims,
            find in-network care, and manage your prescriptions — all in one place.
          </p>
          <div className={styles.trustRow}>
            {[
              'HIPAA-compliant & encrypted',
              'Two-factor authentication',
              'Session timeout for your safety',
              'No passwords to remember with Magic Link',
            ].map(item => (
              <div key={item} className={styles.trustItem}>
                <span className={styles.trustDot} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Welcome back</h2>
          <p className={styles.cardSub}>Sign in or create your member account below.</p>
          <div className={styles.descopeWrap}>
            <Descope
              flowId="LoginFlow"
              onSuccess={() => navigate('/', { replace: true })}
              onError={(e) => console.error('Auth error', e)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        Need help?{' '}
        <a href="tel:+18005551234" className={styles.footerLink}>Call 1-800-555-1234</a>
        {' '}·{' '}
        <a href="#" className={styles.footerLink}>Privacy Policy</a>
      </footer>
    </div>
  );
}
