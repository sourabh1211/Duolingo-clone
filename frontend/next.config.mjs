// The browser only ever calls /api/... on the frontend's own domain; Next.js forwards those
// requests to the FastAPI backend server-side. No CORS, and one public URL.
//
// BACKEND_URL is read at build time (Vercel → Settings → Environment Variables, then redeploy).
// NEXT_PUBLIC_API_URL is still accepted for older setups.
const configured = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

// Fail the Vercel build loudly instead of shipping a site that points at localhost
// (frontend/.env supplies localhost for local development, so check for that too).
if (process.env.VERCEL && (!configured || /localhost|127\.0\.0\.1/.test(configured))) {
  throw new Error(
    "BACKEND_URL is not set. In the Vercel frontend project add BACKEND_URL = https://<your-backend>.onrender.com, then redeploy.",
  );
}

const BACKEND_URL = (configured || "http://localhost:8000")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, ""); // tolerate a pasted ".../api"

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Shown on the "can't reach the server" screen so a wrong URL is obvious.
  env: { BACKEND_URL_DISPLAY: BACKEND_URL },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default nextConfig;
