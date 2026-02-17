/**
 * OptimizedImage Component
 *
 * Smart image component that automatically selects the best rendering strategy
 * based on image type and use case.
 *
 * Usage:
 * ```tsx
 * <OptimizedImage
 *   src="/image/Title.avif"
 *   alt="Hero background"
 *   type={ImageType.STATIC_BACKGROUND}
 *   fill
 *   priority
 * />
 * ```
 */

'use client';

import Image from 'next/image';
import { ImageType, IMAGE_STRATEGY, type ImageTypeKey } from '@/lib/image-config';
import { CSSProperties } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  type: ImageTypeKey;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  style?: CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  type,
  className = '',
  width,
  height,
  priority = false,
  fill = false,
  quality = 75,
  sizes,
  onLoad,
  style,
}: OptimizedImageProps) {
  const strategy = IMAGE_STRATEGY[type];

  // Use native <img> tag for static AVIF images
  if (strategy.component === 'img') {
    const imgStyle: CSSProperties = fill
      ? {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style,
        }
      : style || {};

    return (
      // Intentional native img usage for pre-optimized static assets.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : strategy.loading}
        decoding="async"
        className={className}
        style={imgStyle}
        onLoad={onLoad}
      />
    );
  }

  // Use Next.js Image component for dynamic content
  return (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={className}
      style={style}
      onLoad={onLoad}
      unoptimized={!strategy.optimization}
    />
  );
}

// Re-export ImageType for convenience
export { ImageType };
