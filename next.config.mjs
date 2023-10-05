import { withPlausibleProxy } from 'next-plausible';
/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
});

export default nextConfig;
