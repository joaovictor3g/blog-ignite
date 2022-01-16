import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import useSWR from 'swr';

import { getPrismicClient } from '../../services/prismic';

import { AiOutlineCalendar } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { FiClock } from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDate } from '../../utils/formatDate';
import axios from 'axios';

interface Post {
  firstPublicationDate: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    readingTime: number;
    author: string;
    content: {
      heading: string;
      body: string;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props: PostProps) {
  const { post } = props;

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <div className={styles.container}>
        <img src={post.data.banner.url} alt={post.data.banner.alt} />

        <div className={styles.content}>
          <h1 className={styles.title}>{post.data.title}</h1>
          <div className={commonStyles.userDate}>
            <time className={commonStyles.time}>
              <AiOutlineCalendar size={18} /> {post.firstPublicationDate}
            </time>
            <span className={commonStyles.author}>
              <BiUser size={18} /> {post.data.author}
            </span>
            <span className={commonStyles.readingTime}>
              <FiClock size={18} /> {post.data.readingTime} min
            </span>
          </div>
          <div className={styles.box}>
            {post.data.content.map(content => (
              <>
                <h3 className={styles.heading}>{content.heading}</h3>
                <div
                  className={styles.body}
                  dangerouslySetInnerHTML={{ __html: content.body }}
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );

  const paths = posts.results
    .slice(0, 3)
    .map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const content = response.data.content.map(c => ({
    heading: c.heading,
    body: RichText.asHtml(c.body),
  }));

  const post: Post = {
    firstPublicationDate: formatDate(new Date(response.first_publication_date)),
    data: {
      author: response.data.author,
      banner: {
        alt: response.data.banner.alt,
        url: response.data.banner.url,
      },
      content,
      title: RichText.asText(response.data.title),
      readingTime: Number(response.data.reading_time) / 60,
    },
  };

  return {
    props: { post },
    revalidate: 60 * 30,
  };
};
