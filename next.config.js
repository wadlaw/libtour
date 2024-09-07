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
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/shame',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/infamy',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/tens',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/worst',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/worstrounds',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/worststableford',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/worstmedal',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/hallofinfamy',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/hallofshame',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/wall',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/wos',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/igiveup',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/whereisit',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/whatisit',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/secretsquirrel',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/supersecretpage',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/hackers',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/poop',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/cantfindit',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/notveryhidden',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/hiddeninplainsight',
            destination: '/wallofshame',
            permanent: true,
          },
          {
            source: '/boards',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/board',
            destination: '/honourboards',
            permanent: true,
          },
          {
            source: '/honourboard',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honours',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honour',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honors',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honor',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honorboards',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honorboard',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honoursboard',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honourboards',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/honorsboard',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/winners',
            destination: '/honoursboards',
            permanent: true,
          },
          {
            source: '/losers',
            destination: '/honoursboards',
            permanent: true,
          },
        ]
      },
};

export default config;
