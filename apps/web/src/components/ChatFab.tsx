import styles from '../App.module.css';

export default function ChatFab() {
  return (
    <div className={styles.fab}>
      <button className={styles.fabBtn} aria-label="Open chat">
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>chat_bubble</span>
        <span className={styles.fabBadge} />
      </button>
    </div>
  );
}
