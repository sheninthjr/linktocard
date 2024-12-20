/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ideogram.ai', 'www.google.com', 'lh3.googleusercontent.com'],
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
