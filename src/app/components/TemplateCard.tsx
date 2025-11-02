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
    <div className="w-full h-full aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-900">
      {/* 이미지 - 항상 렌더링 (IntersectionObserver 제거) */}
      <OptimizedImage
        src={template.image}
        alt={template.title}
        type={ImageType.TEMPLATE_THUMBNAIL}
        fill
        className="object-cover transition-all duration-300 group-hover:scale-110 opacity-100"
        priority={index < 13}
      />

      {/* Gradient Overlay - 항상 표시 */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none opacity-80 group-hover:opacity-90"
      />

      {/* Text Content - 항상 표시 */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white pointer-events-none transition-all duration-300 opacity-100 translate-y-0"
      >
        <h3 className="text-base lg:text-xl font-bold mb-1 truncate">{template.title}</h3>
        <p className="text-xs lg:text-sm text-gray-300">{template.category}</p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Re-render if template ID OR index changes (for infinite scroll)
  return prevProps.template.id === nextProps.template.id &&
         prevProps.index === nextProps.index;
});

TemplateCard.displayName = 'TemplateCard';

export default TemplateCard;
