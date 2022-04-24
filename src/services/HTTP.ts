import ky from 'ky-universal';

const config = { timeout: 5000 };

const instance = ky.create({
  ...config,
});

export default instance;
