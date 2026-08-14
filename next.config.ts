import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const isEc2Static = process.env.DEPLOY_TARGET === "ec2";
const isStaticExport = isGitHubPages || isEc2Static;

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: isGitHubPages ? "/khelkatha" : "",
  assetPrefix: isGitHubPages ? "/khelkatha/" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    // The static Pages app does not import the Cloudflare-only db/worker files.
    ignoreBuildErrors: isStaticExport,
  },
};

export default nextConfig;
