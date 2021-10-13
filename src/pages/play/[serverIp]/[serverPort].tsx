import PlayServer from '../../../views/PlayServer/PlayServer';

export default PlayServer;

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};
