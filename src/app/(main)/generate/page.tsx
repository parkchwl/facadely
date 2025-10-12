'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// templates를 임시로 빈 배열로 설정 (나중에 실제 데이터로 교체 필요)
const templates: any[] = [];

export default function GeneratePage() {
  const router = useRouter();

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/editor?templateId=${templateId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Choose a Template</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={template.previewImage} alt={template.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
                <p className="text-gray-700 mb-4">{template.description}</p>
                <div className="flex justify-between">
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    Preview
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
