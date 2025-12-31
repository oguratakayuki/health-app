/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@backend': require('path').resolve(__dirname, 'src/backend'),
      '@frontend': require('path').resolve(__dirname, 'src/frontend'),
    };
    return config;
  },
};

module.exports = nextConfig;
