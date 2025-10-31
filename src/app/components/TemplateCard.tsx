'use client';

import React, { useState, useEffect } from 'react';
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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset imageLoaded when template image changes (for infinite scroll)
  useEffect(() => {
    setImageLoaded(false);
  }, [template.image]);

  return (
    <div className="w-full h-full aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-900">
      {/* Skeleton Loading - 이미지 로드 전 */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 skeleton-shimmer" />
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
            <div className="h-4 lg:h-6 bg-gray-700/50 rounded w-3/4 mb-2" />
            <div className="h-3 lg:h-4 bg-gray-700/50 rounded w-1/2" />
          </div>
        </div>
      )}

      {/* 이미지 - 항상 렌더링 (IntersectionObserver 제거) */}
      <OptimizedImage
        src={template.image}
        alt={template.title}
        type={ImageType.TEMPLATE_THUMBNAIL}
        fill
        className={`object-cover transition-all duration-300 group-hover:scale-110 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={index < 13}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Gradient Overlay - 항상 표시 */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
          imageLoaded ? 'opacity-80' : 'opacity-0'
        } group-hover:opacity-90`}
      />

      {/* Text Content - 항상 표시 */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white pointer-events-none transition-all duration-300 ${
          imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
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
