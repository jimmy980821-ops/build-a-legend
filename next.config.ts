import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages && repository ? `/${repository}` : "";
const globalSettingsApi = "https://full-court-lab-jimmy.fumin081.chatgpt.site";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export" as const } : {}),
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_SETTINGS_API_URL: process.env.NEXT_PUBLIC_SETTINGS_API_URL || (isGitHubPages ? globalSettingsApi : ""),
  },
  images: { unoptimized: true },
  typescript: { tsconfigPath: "tsconfig.next.json" },
};

export default nextConfig;
