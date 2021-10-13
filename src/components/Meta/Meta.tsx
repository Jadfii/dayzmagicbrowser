import React, { useMemo } from 'react';
import Head from 'next/head';
import { DOMAIN, META_DESCRIPTION, TITLE_PREFIX } from '../../constants/meta.constant';
import { IMAGE_BUCKET } from '../../constants/links.constant';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
}

const Meta: React.FC<Props> = ({ title }) => {
  const router = useRouter();
  const metaTitle = useMemo(() => `${TITLE_PREFIX}${title ? ` - ${title}` : ''}`, [title]);

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} key="ogtitle" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} key="ogdesc" />

        <meta property="og:site_name" content={TITLE_PREFIX} key="ogsitename" />

        <meta property="og:image" content={`${IMAGE_BUCKET}home.jpg`} key="ogimage" />

        <meta property="og:url" content={`${DOMAIN}${router?.pathname}`} key="ogurl" />

        <link rel="shortcut icon" href="/assets/favicon.png" key="favicon" />
      </Head>
    </>
  );
};

export default Meta;
