import styles from '../App.module.css';

export default function EditorialBlock() {
  return (
    <div className={styles.editorialCard}>
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBms9t2-eOxDEhZJwyHSNys680XsgfiK7gLZgH7df08rqpptzJY4T64-g4-RKe5utgLc85BsPiXSzcjYjxCwP-bh4lKDDpmznqU8MBXFoSq4XPgCbD528WOGo4lWLPTBQ28JFfApYrWLTDo4EoOpgMbkfmuzITSYrjDpPdS49z03pRCBtujJvFVy8RMjCXRjTfPJwxbYlLFaffYyHAK8WgvN7Sz6ToZ843fT5hNO07cXvVF8G6u4Dm6zzG8B6lvwTwc5Zf6OOWrrhH3"
        alt="Mindfulness Moment"
        className={styles.editorialImg}
      />
      <div className={styles.editorialOverlay} />
      <div className={styles.editorialBody}>
        <h4 className={styles.editorialTitle}>Focus on Mindfulness this morning.</h4>
        <p className={styles.editorialDesc}>Experience our curated 5-minute guided meditation designed for mental clarity and calm.</p>
        <button className={styles.editorialBtn}>Start Now</button>
      </div>
    </div>
  );
}
