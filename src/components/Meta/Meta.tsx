import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TITLE_PREFIX } from '../../constants/meta.constant';

interface Props {
  title?: string;
}

const Meta: React.FC<Props> = ({ title }) => {
  return (
    <>
      <Helmet>
        <title>{`${TITLE_PREFIX}${title ? `- ${title}` : ''}`}</title>
      </Helmet>
    </>
  );
};

export default Meta;
