'use client';

import React from 'react';
import OptimizedImage, { ImageType } from './OptimizedImage';

interface Template {
  id: number;
  title: string;
  category: string;
  image: string;
}

interface TemplateCardProps {
  template: Template;
  index: number;
  handleImageLoad?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = React.memo(({ template, index, handleImageLoad }) => {
  return (
    <div className="w-full h-full aspect-[3/4] relative overflow-hidden rounded-2xl cursor-default bg-black block shadow-md border border-white/5 transition-all duration-300">
      <OptimizedImage
        src={template.image}
        alt={template.title}
        type={ImageType.TEMPLATE_THUMBNAIL}
        fill
        sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 384px"
        className="object-cover opacity-100"
        priority={index < 6}
        onLoad={handleImageLoad}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.template.id === nextProps.template.id &&
    prevProps.index === nextProps.index &&
    prevProps.handleImageLoad === nextProps.handleImageLoad;
});

TemplateCard.displayName = 'TemplateCard';

export default TemplateCard;
