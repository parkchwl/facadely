'use client';

import React from 'react';
import OptimizedImage, { ImageType } from './OptimizedImage';

interface Template {
  id: string | number;
  title: string;
  category: string;
  image: string;
}

interface TemplateCardProps {
  template: Template;
  index: number;
  imageWidthPx?: number;
  handleImageLoad?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = React.memo(({ template, index, imageWidthPx, handleImageLoad }) => {
  const imageSizes = imageWidthPx ? `${Math.round(imageWidthPx)}px` : '(max-width: 640px) 224px, (max-width: 1024px) 288px, 384px';

  return (
    <div className="w-full h-full aspect-[3/4] relative overflow-hidden rounded-2xl cursor-default bg-black block shadow-md border border-white/5 transition-all duration-300">
      <OptimizedImage
        src={template.image}
        alt={template.title}
        type={ImageType.TEMPLATE_THUMBNAIL}
        fill
        sizes={imageSizes}
        className="object-cover opacity-100"
        priority={index < 1}
        onLoad={handleImageLoad}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.template.id === nextProps.template.id &&
    prevProps.index === nextProps.index &&
    prevProps.imageWidthPx === nextProps.imageWidthPx &&
    prevProps.handleImageLoad === nextProps.handleImageLoad;
});

TemplateCard.displayName = 'TemplateCard';

export default TemplateCard;
