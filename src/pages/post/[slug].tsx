import React from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import { AiOutlineCalendar } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { FiClock } from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDate } from '../../utils/formatDate';
import { UtterancesComments } from '../../components/Utterance';
import { Preview } from '../../components/Preview';
import { Pagination } from './Pagination';

interface Post {
  firstPublicationDate: string | null;
  lastPublicationDate: string | null;
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
  preview: boolean;
  nextPage: PostPagination;
  previousPage: PostPagination;
}

type PostPagination = {
  uid: string;
  title: string;
};

export default function Post(props: PostProps) {
  const { post, preview, nextPage, previousPage } = props;

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

            <span className={commonStyles.editedAt}>
              * editado em {post.lastPublicationDate}
            </span>
          </div>
          <div className={styles.box}>
            {post.data.content.map((content, i) => (
              <React.Fragment key={i}>
                <h3 className={styles.heading}>{content.heading}</h3>
                <div
                  className={styles.body}
                  dangerouslySetInnerHTML={{ __html: content.body }}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
        <Pagination nextPage={nextPage} previousPage={previousPage} />
        <UtterancesComments />
        {preview && <Preview />}
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const content = response.data.content.map(c => ({
    heading: c.heading,
    body: RichText.asHtml(c.body),
  }));

  const post: Post = {
    firstPublicationDate: formatDate(new Date(response.first_publication_date)),
    lastPublicationDate:
      formatDate(new Date(response.last_publication_date)) +
      ' às ' +
      formatDate(new Date(response.last_publication_date), 'HH:mm'),
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

  const allPosts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
      ref: previewData?.ref ?? null,
    }
  );

  const currentIndex = allPosts.results.findIndex(p => p.uid === response.uid);

  let nextPage = null;
  let previousPage = null;

  if (currentIndex >= 0) {
    const nextValues = allPosts.results[currentIndex + 1];
    const prevValues = allPosts.results[currentIndex - 1];

    if (nextValues) {
      nextPage = {
        uid: nextValues.uid,
        title: RichText.asText(allPosts.results[currentIndex + 1].data.title),
      };
    }

    if (prevValues) {
      previousPage = {
        uid: prevValues.uid,
        title: RichText.asText(allPosts.results[currentIndex - 1].data.title),
      };
    }
  }

  return {
    props: { post, preview, nextPage, previousPage },
    revalidate: 60 * 30,
  };
};
