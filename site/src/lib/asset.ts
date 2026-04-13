// Prefix a public-folder path with the deployment basePath.
// Works for raw <img src>, background images, etc., where Next.js
// doesn't auto-prefix (unlike next/link and next/image).
export function asset(path: string): string {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/")) path = `/${path}`;
  return `${prefix}${path}`;
}
