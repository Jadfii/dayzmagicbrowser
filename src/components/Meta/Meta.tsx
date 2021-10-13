import React, { useMemo } from 'react';
import Head from 'next/head';
import { TITLE_PREFIX } from '../../constants/meta.constant';

interface Props {
  title?: string;
}

const Meta: React.FC<Props> = ({ title }) => {
  const metaTitle = useMemo(() => `${TITLE_PREFIX}${title ? `- ${title}` : ''}`, [title]);

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />

        <link rel="icon" href="/favicon.png" />
      </Head>
    </>
  );
};

export default Meta;
