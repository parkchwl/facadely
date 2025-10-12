'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
}

// templates를 임시로 빈 배열로 설정 (나중에 실제 데이터로 교체 필요)
const templates: Template[] = [];

export default function GeneratePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading templates
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/editor?templateId=${templateId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Choose a Template</h1>
        {templates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-4">No templates available yet</p>
            <p className="text-gray-400">Check back soon for amazing templates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full h-48">
                  <Image
                    src={template.previewImage}
                    alt={`${template.name} template preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={80}
                    priority={index < 6}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
                  <p className="text-gray-700 mb-4">{template.description}</p>
                  <div className="flex justify-between">
                    <button
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      aria-label={`Preview ${template.name} template`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleSelectTemplate(template.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      aria-label={`Use ${template.name} template`}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
