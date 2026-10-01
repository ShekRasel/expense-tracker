/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // This public default also works on fresh deployments without a local .env.
    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      "https://expense-backend-mu-livid.vercel.app"
    ).replace(/\/+$/, "");

    // The browser calls its own origin; Next.js forwards requests to the API.
    // This avoids requiring every local/preview frontend origin in backend CORS.
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
