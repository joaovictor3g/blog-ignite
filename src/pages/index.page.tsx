import { GetStaticProps } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { AiOutlineCalendar } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatDate } from '../utils/formatDate';
import { Preview } from '../components/Preview';

interface Post {
  slug?: string;
  firstPublicationDate: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  nextPage: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({ postsPagination, preview }: HomeProps) {
  const { results } = postsPagination;

  return (
    <div className={styles.container}>
      {results.map(post => (
        <div className={styles.box} key={post.slug}>
          <Link href={`/post/${post.slug}`}>
            <a className={styles.title}>{post.data.title}</a>
          </Link>
          <span className={styles.soonDescription}>{post.data.subtitle}</span>

          <div className={commonStyles.userDate}>
            <time className={commonStyles.time}>
              <AiOutlineCalendar size={18} /> {post.firstPublicationDate}
            </time>
            <span className={commonStyles.author}>
              <BiUser size={18} /> {post.data.author}
            </span>
          </div>
        </div>
      ))}
      {preview && <Preview />}
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
      ref: previewData?.ref ?? null,
    }
  );

  const posts = postsResponse.results.map(post => ({
    slug: post.uid,
    firstPublicationDate: formatDate(new Date(post.first_publication_date)),
    data: {
      title: post.data.title[0].text,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        nextPage: postsResponse.next_page,
        results: posts,
      },
      preview,
    },
  };
};
