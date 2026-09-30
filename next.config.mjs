/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
    if (!apiUrl) {
      throw new Error(
        "Set NEXT_PUBLIC_API_URL in .env before starting Next.js.",
      );
    }

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
