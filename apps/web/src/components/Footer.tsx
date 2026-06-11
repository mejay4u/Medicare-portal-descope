import styles from '../App.module.css';
import { colors } from '../theme';

const links = ['Privacy Policy', 'Terms of Service', 'Accessibility Help', 'Contact Support'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <div className={styles.footerBrand}>AmeriHealth</div>
          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 280, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>© 2024 AmeriHealth. Dedicated to your wellness journey.</p>
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {links.map(link => (
            <a key={link} href="#" className={styles.footerLink}>{link}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: colors.primary, fontWeight: 700 }}>
          <span className="material-symbols-outlined">shield_with_heart</span>
          NCQA Accredited
        </div>
      </div>
    </footer>
  );
}
