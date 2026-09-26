// Image fields across the CMS (and Product.images) hold either a path
// under /public ("/images/team/jane.jpg") or a full http(s) URL.

export function isExternalImage(src: string) {
  return /^https?:\/\//i.test(src);
}

export function isValidImageSrc(src: string) {
  if (isExternalImage(src)) return URL.canParse(src);
  // "//host/x.jpg" is protocol-relative, i.e. external - not a local path.
  return src.startsWith("/") && !src.startsWith("//");
}

// next/image only optimizes remote images from hosts listed in
// images.remotePatterns (next.config.ts), and throws for any other host.
// Admins can paste a URL from anywhere, so external images skip the
// optimizer rather than breaking the page.
export function imageProps(src: string) {
  return { src, unoptimized: isExternalImage(src) };
}
