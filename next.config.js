/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "outline.storage.iran.liara.space",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);
