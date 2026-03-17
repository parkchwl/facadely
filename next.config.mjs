import { dirname, join } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const defaultApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.INTERNAL_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.facadely.com/api/v1"
    : "http://localhost:8080/api/v1");
const defaultApiOrigin = (() => {
  try {
    return new URL(defaultApiBaseUrl).origin;
  } catch {
    return process.env.NODE_ENV === "production"
      ? "https://api.facadely.com"
      : "http://localhost:8080";
  }
})();
const connectSrc = ["'self'", defaultApiOrigin, "http://localhost:8080", "https://localhost:8080"].join(" ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  webpack: (config, { dir }) => {
    const projectNodeModules = join(dir, "node_modules");
    const currentModules = config.resolve?.modules ?? [];

    if (!currentModules.includes(projectNodeModules)) {
      config.resolve = config.resolve ?? {};
      config.resolve.modules = [projectNodeModules, ...currentModules];
    }

    return config;
  },
  images: {
    // Custom loader for flexible image handling (CDN-ready)
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src ${connectSrc}; frame-ancestors 'self'; base-uri 'self'; form-action 'self';`
          }
        ]
      }
    ];
  },
};

export default nextConfig;
