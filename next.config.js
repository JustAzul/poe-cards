module.exports = {
  images: {
    domains: ['web.poecdn.com'],
  },
  async headers() {
    const workerWsOrigin = process.env.NEXT_PUBLIC_WS_URL;
    const analyticsOrigins = "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net";
    const connectSrc = workerWsOrigin
      ? `'self' ${workerWsOrigin} ${analyticsOrigins}`
      : `'self' ${analyticsOrigins}`;

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
