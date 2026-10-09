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
  async rewrites() {
    return {
      beforeFiles: [
        // basePath外のルート (/images/...) へのアクセスを /medical-tax-calculator/images/... にリライト
        {
          source: '/images/:path*',
          destination: '/medical-tax-calculator/images/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
