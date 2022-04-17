import ky from 'ky-universal';

const config = { timeout: 3000 };

const instance = ky.create({
  ...config,
});

export default instance;
