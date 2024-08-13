/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    // trailingSlash: true,
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
          {
            source: '/hof',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/fame',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/hall',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/eagles',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/best',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/bestrounds',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/beststableford',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/bestmedal',
            destination: '/halloffame',
            permanent: true,
          },
          {
            source: '/hoi',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/shame',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/infamy',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/tess',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/worst',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/worstrounds',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/worststableford',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/worstmedal',
            destination: '/hallofshame',
            permanent: true,
          },
          {
            source: '/hallofinfamy',
            destination: '/hallofshame',
            permanent: true,
          },
        ]
      },
};

export default config;
