import { useWelcomeSection } from '@medicare/shared';
import styles from '../App.module.css';

export default function WelcomeSection() {
  const { greeting, firstName, subtitle, isLoading } = useWelcomeSection();

  return (
    <section style={{ marginBottom: 48 }}>
      {isLoading ? (
        <>
          <div className={styles.skeleton} style={{ height: 44, width: 340, marginBottom: 12, borderRadius: 8 }} />
          <div className={styles.skeleton} style={{ height: 20, width: 260, borderRadius: 6 }} />
        </>
      ) : (
        <>
          <h1 className={styles.welcomeHeading}>{greeting}, {firstName}.</h1>
          <p className={styles.welcomeSub}>{subtitle}</p>
        </>
      )}
    </section>
  );
}
