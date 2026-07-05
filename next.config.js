const WORKER_WS_ORIGIN = 'wss://poe-cards-realtime.justazul.workers.dev';

module.exports = {
  images: {
    domains: ['web.poecdn.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `connect-src 'self' ${WORKER_WS_ORIGIN};`,
          },
        ],
      },
    ];
  },
};
