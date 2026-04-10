import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath:
    process.env.BASE_PATH ??
    (process.env.NODE_ENV === "production" ? "/pycon-pydata-2026" : ""),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: { unoptimized: true },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      ["rehype-pretty-code", { theme: "github-dark", keepBackground: true }],
    ],
  },
});

export default withMDX(nextConfig);
