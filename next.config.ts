import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the development badge from covering the viewport navigation.
  devIndicators: false,
  experimental: {
    serverActions: {
      // Article images are resized in the browser and capped at 3.5 MB.
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
