/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/medical-tax-calculator',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
