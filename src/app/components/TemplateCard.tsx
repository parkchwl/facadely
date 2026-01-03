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
}

const TemplateCard: React.FC<TemplateCardProps> = React.memo(({ template, index }) => {
  return (
    <div className="w-full h-full aspect-[3/4] relative overflow-hidden rounded-2xl cursor-default bg-gray-900 block">
      <OptimizedImage
        src={template.image}
        alt={template.title}
        type={ImageType.TEMPLATE_THUMBNAIL}
        fill
        sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 384px"
        className="object-cover opacity-100"
        priority={index < 6}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.template.id === nextProps.template.id &&
    prevProps.index === nextProps.index;
});

TemplateCard.displayName = 'TemplateCard';

export default TemplateCard;
