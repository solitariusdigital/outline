import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    loadPaths: [process.cwd()],
    includePaths: [process.cwd()],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bucket.outlinecommunity.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);
