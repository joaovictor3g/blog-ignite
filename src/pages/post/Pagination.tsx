import Link from 'next/link';
import styles from './pagination.module.scss';

type PostPagination = {
  uid: string;
  title: string;
};

interface PaginationProps {
  nextPage: PostPagination;
  previousPage: PostPagination;
}

export const Pagination: React.FC<PaginationProps> = ({
  nextPage,
  previousPage,
}) => {
  return (
    <div className={styles.paginate}>
      {!!previousPage && (
        <div className={styles.goTo}>
          <h3>{previousPage.title}</h3>
          <Link href={`/post/${previousPage.uid}`}>
            <a>Post anterior</a>
          </Link>
        </div>
      )}
      {!!nextPage && (
        <div className={`${styles.goTo} ${styles.next}`}>
          <h3>{nextPage.title}</h3>
          <Link href={`/post/${nextPage.uid}`}>
            <a>Próximo post</a>
          </Link>
        </div>
      )}
    </div>
  );
};
