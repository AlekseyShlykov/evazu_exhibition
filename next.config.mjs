const repositoryName = process.env.GITHUB_ACTIONS
  ? (process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "")
  : "";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = configuredBasePath || (repositoryName ? `/${repositoryName}` : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: { root: process.cwd() }
};

export default nextConfig;
