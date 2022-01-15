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
}

export default function Home({ postsPagination }: HomeProps) {
  const { results } = postsPagination;

  return (
    <div className={styles.container}>
      {results.map(post => (
        <div className={styles.box} key={post.slug}>
          <Link href={`/post/${post.slug}`}>
            <a className={styles.title}>{post.data.title}</a>
          </Link>
          <span className={styles.soonDescription}>{post.data.subtitle}</span>

          <div className={styles.userDate}>
            <time>
              <AiOutlineCalendar size={18} /> {post.firstPublicationDate}
            </time>
            <span className={styles.author}>
              <BiUser size={18} /> {post.data.author}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ctx => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );

  const posts = postsResponse.results.map(post => ({
    slug: post.uid,
    firstPublicationDate: format(new Date(post.first_publication_date), 'PP', {
      locale: ptBR,
    }),
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
    },
  };
};
