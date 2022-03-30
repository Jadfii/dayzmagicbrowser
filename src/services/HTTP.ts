import ky from 'ky-universal';

const config = {};

const instance = ky.create({
  ...config,
});

export default instance;
