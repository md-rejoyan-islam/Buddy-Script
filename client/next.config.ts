import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
      // {
      //   source: "/api/auth/:path*",
      //   destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`,
      // },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "103.84.157.91",
        port: "9000",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
