import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { TITLE_PREFIX } from '../../constants/meta.constant';

interface Props {
  title?: string;
}

const Meta: React.FC<Props> = ({ title }) => {
  const metaTitle = useMemo(() => `${TITLE_PREFIX}${title ? `- ${title}` : ''}`, [title]);

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
    </>
  );
};

export default Meta;
