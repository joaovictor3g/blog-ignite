import Link from 'next/link';
import styles from './styles.module.scss';

export function Preview() {
  return (
    <aside className={styles.previewMode}>
      <Link href="/api/exit-preview">
        <a>Sair do modo Preview</a>
      </Link>
    </aside>
  );
}
