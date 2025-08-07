/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eksrrkohkf.ufs.sh',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'paulnicklen.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;