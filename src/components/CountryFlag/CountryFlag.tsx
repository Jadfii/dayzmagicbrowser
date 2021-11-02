import React from 'react';
import Image from 'next/image';

interface Props {
  countryCode: string;
  country?: string;
}

const CountryFlag: React.FC<Props> = ({ countryCode, country }) => {
  return (
    <>
      <Image
        alt={country}
        src={`https://catamphetamine.gitlab.io/country-flag-icons/3x2/${countryCode}.svg`}
        loading="lazy"
        loader={({ src }) => src}
        unoptimized
        layout="fill"
      />
    </>
  );
};

export default CountryFlag;
