/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    trailingSlash: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: ''
            }
        ]
    },
    async redirects() {
        return [
          {
            source: '/comps',
            destination: '/events',
            permanent: true,
          },
          {
            source: '/comps/:slug',
            destination: '/events/:slug',
            permanent: true,
          },
          {
            source: '/myaccount',
            destination: '/account',
            permanent: true,
          },
          {
            source: '/home',
            destination: '/',
            permanent: true,
          },
          {
            source: '/league',
            destination: '/teams',
            permanent: true,
          },
          {
            source: '/table',
            destination: '/teams',
            permanent: true,
          },
          {
            source: '/leaguetable',
            destination: '/teams',
            permanent: true,
          },
          {
            source: '/league-table',
            destination: '/teams',
            permanent: true,
          },
          {
            source: '/standings',
            destination: '/teams',
            permanent: true,
          },
        ]
      },
};

export default config;
