import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the development badge from covering the viewport navigation.
  devIndicators: false,
  images: {
    // Cloudflare's optimizer only reads static files, so uploads under /media
    // would 404 through it. The static images are already small webp files.
    // ponytail: uploads ship at upload size (max 2000px); add Cloudflare Images if article pages get heavy.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Article images are resized in the browser and capped at 3.5 MB.
      bodySizeLimit: "4mb",
    },
  },
  // The canonical URL, sitemap and Open Graph tags all name the bare domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.moudy.xyz" }],
        destination: "https://moudy.xyz/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Same two-year HSTS that Vercel sent, so browsers keep forcing HTTPS.
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
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
