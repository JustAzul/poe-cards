module.exports = {
  images: {
    domains: ['web.poecdn.com'],
  },
  async headers() {
    const workerWsOrigin = process.env.NEXT_PUBLIC_WS_URL;
    const connectSrc = workerWsOrigin ? `'self' ${workerWsOrigin}` : "'self'";

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `connect-src ${connectSrc};`,
          },
        ],
      },
    ];
  },
};
