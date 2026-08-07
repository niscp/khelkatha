import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/khelkatha" : "",
  assetPrefix: isGitHubPages ? "/khelkatha/" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    // The static Pages app does not import the Cloudflare-only db/worker files.
    ignoreBuildErrors: isGitHubPages,
  },
};

export default nextConfig;
