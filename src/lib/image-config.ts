/**
 * Image Type Classification System
 *
 * This config defines how different types of images should be handled
 * for optimal performance and maintainability.
 */

export const ImageType = {
  // Static background/hero images - don't change, fixed size
  STATIC_BACKGROUND: 'static-bg',

  // Template thumbnails - need lazy loading in lists
  TEMPLATE_THUMBNAIL: 'template-thumb',

  // User-generated content (future)
  USER_CONTENT: 'user-content',

  // External URLs
  EXTERNAL: 'external',
} as const;

export type ImageTypeKey = typeof ImageType[keyof typeof ImageType];

interface ImageStrategy {
  component: 'img' | 'Image';
  loading: 'eager' | 'lazy';
  optimization: boolean;
  reason: string;
}

export const IMAGE_STRATEGY: Record<ImageTypeKey, ImageStrategy> = {
  [ImageType.STATIC_BACKGROUND]: {
    component: 'Image',
    loading: 'lazy',
    optimization: true,
    reason: 'Background images should use responsive variants; promote only true LCP assets with priority'
  },

  [ImageType.TEMPLATE_THUMBNAIL]: {
    component: 'Image',
    loading: 'lazy',
    optimization: true,
    reason: 'Template lists benefit from responsive image sizing and modern format conversion'
  },

  [ImageType.USER_CONTENT]: {
    component: 'Image',
    loading: 'lazy',
    optimization: true,
    reason: 'Dynamic content, may need format conversion and optimization'
  },

  [ImageType.EXTERNAL]: {
    component: 'Image',
    loading: 'lazy',
    optimization: true,
    reason: 'Unknown format from external source, need Next.js optimization'
  },
};

/**
 * Get the strategy for a specific image type
 */
export function getImageStrategy(type: ImageTypeKey): ImageStrategy {
  return IMAGE_STRATEGY[type];
}
