import PlayServer from '../../../views/PlayServer/PlayServer';

export default PlayServer;

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async () => {
  return {
    props: { serverIp: '', serverPort: '' },
  };
};
