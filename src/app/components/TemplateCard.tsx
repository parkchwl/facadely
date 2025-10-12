'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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

const TemplateCard: React.FC<TemplateCardProps> = ({ template, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px' } // Pre-load images 200px before they enter the viewport
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full h-full aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl bg-gray-900 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {isVisible && (
        <>
          <Image
            src={template.image}
            alt={template.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            quality={80}
            priority={index < 8}
            loading={index < 8 ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA//9k="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white pointer-events-none">
            <h3 className="text-base lg:text-xl font-bold mb-1 truncate">{template.title}</h3>
            <p className="text-xs lg:text-sm text-gray-300">{template.category}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateCard;
