import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './header.module.scss';

export default function Header() {
  const router = useRouter();

  function handleGoHome() {
    router.push('/');
  }

  return (
    <header className={styles.header}>
      <Image
        src={'/logo.svg'}
        alt="logo"
        width={240}
        height={26}
        onClick={handleGoHome}
      />
    </header>
  );
}
