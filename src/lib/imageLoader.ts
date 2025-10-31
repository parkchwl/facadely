/**
 * Custom Image Loader for Next.js
 *
 * This loader allows us to control how images are loaded and enables
 * easy CDN integration in the future.
 *
 * Current: Returns local paths as-is
 * Future: Can integrate with CDN (Cloudflare Images, Vercel, etc.)
 */

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({
  src,
  width,
  quality = 75
}: ImageLoaderProps): string {
  // Future: CDN integration
  // if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CDN_URL) {
  //   return `${process.env.NEXT_PUBLIC_CDN_URL}${src}?w=${width}&q=${quality}`;
  // }

  // Future: Cloudflare Images example
  // if (process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT) {
  //   const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT;
  //   return `https://imagedelivery.net/${accountHash}${src}/w=${width},q=${quality}`;
  // }

  // Current: Return local path as-is for AVIF images
  // AVIF is already optimized, no need for additional processing
  return src;
}
