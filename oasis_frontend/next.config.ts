import type { NextConfig } from "next";

// The Express backend URL. Defaults to the local dev server.
// In production, set BACKEND_URL to the deployed oasis_backend URL.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
