/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
  // Avoid prisma engine binary issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("prisma/client");
    }
    return config;
  },
};

export default nextConfig;
