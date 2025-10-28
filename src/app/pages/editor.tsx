'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Monitor } from 'lucide-react';

interface Website {
  [key: string]: unknown;
}

// 임시로 비워둔 컴포넌트들 (실제 구현 필요)
const useWebsiteBuilderStore = () => ({
  setWebsite: () => {},
  isPreviewMode: false,
  isLayoutsPanelOpen: false,
  editorViewMode: 'single-edit'
});

const LayersPanel = () => <div>Layers Panel</div>;
const LayoutsPanel = () => <div>Layouts Panel</div>;
const Canvas = () => <div>Canvas</div>;
const PropertiesPanel = () => <div>Properties Panel</div>;
const EditorHeader = () => <div>Editor Header</div>;
const LinkClickToast = () => null;
const EditorPage = () => {
  const { setWebsite, isPreviewMode, isLayoutsPanelOpen, editorViewMode } = useWebsiteBuilderStore();
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('templateId');
  const templateLoadedRef = useRef<string | null>(null); // 로드된 템플릿 추적
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const MIN_EDITOR_WIDTH = 900;

  useEffect(() => {
    // 이미 같은 템플릿을 로드했다면 스킵
    if (templateId && templateId !== templateLoadedRef.current) {
      templateLoadedRef.current = templateId;
      
      const loadTemplate = async () => {
        try {
          // 템플릿 ID에 기반한 JSON 파일을 가져옵니다.
          let templateModule;
          
          // 여러 파일명 패턴을 시도합니다
          try {
            // 1. 기본 패턴: templateId.json
            templateModule = await import(`../data/${templateId}.json`);
          } catch {
            try {
              // 2. -template 패턴: templateId-template.json
              templateModule = await import(`../data/${templateId}-template.json`);
            } catch (error) {
              // 3. 기존 파일들과의 호환성을 위한 특별 케이스들
              const legacyMapping: Record<string, string> = {
                'sunny-lake': 'sunny-lake-template',
                'landing-page': 'landing-page-template',
                'modern-saas-template': 'modern-saas-template',
                'modern-ecommerce-template': 'modern-ecommerce-template'
              };

              const mappedId = legacyMapping[templateId];
              if (mappedId) {
                templateModule = await import(`../data/${mappedId}.json`);
              } else {
                throw error;
              }
            }
          }
          
          const templateData: Website = templateModule.default;
          setWebsite();
        } catch (error) {
          console.error("Error loading template:", error);
          console.error("Attempted to load template with ID:", templateId);
          // 로드 실패 시 ref 초기화
          templateLoadedRef.current = null;
        }
      };

      loadTemplate();
    }
  }, [templateId, setWebsite]);

  // 창 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isWindowTooSmall = windowWidth < MIN_EDITOR_WIDTH;

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 min-w-0 relative"> {/* Added relative for overlay positioning */}
      <EditorHeader /> {/* Keep header in all modes */}
      <div className={`flex flex-1 min-h-0 ${isPreviewMode ? 'overflow-auto' : 'overflow-hidden'} ${isWindowTooSmall ? 'blur-[2px]' : ''}`}> {/* Added conditional blur */}
        {!isPreviewMode && editorViewMode === 'single-edit' && (
          <div className="w-48 lg:w-56 xl:w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto min-w-0"> {/* Responsive width: sm=192px, lg=224px, xl=256px */}
            <LayersPanel />
          </div>
        )}
        {!isPreviewMode && editorViewMode !== 'single-edit' && (
          <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto min-w-0">
            <LayersPanel />
          </div>
        )}
        {!isPreviewMode && editorViewMode === 'single-edit' && isLayoutsPanelOpen && (
          <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto"> {/* LayoutsPanel */}
            <LayoutsPanel />
          </div>
        )}
        <div className="flex-1 min-w-0"> {/* Canvas container with min-w-0 to prevent overflow */}
          <Canvas />
        </div>
        {!isPreviewMode && editorViewMode === 'single-edit' && (
          <div className="w-64 lg:w-72 xl:w-80 flex-shrink-0 min-w-0"> {/* Responsive width: base=256px, lg=288px, xl=320px */}
            <PropertiesPanel />
          </div>
        )}
      </div>
      
      {/* Window Size Warning Overlay */}
      {isWindowTooSmall && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md mx-4 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
              <Monitor size={64} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Screen Too Small
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To enjoy the full editor experience, make sure your browser is at least <strong>{MIN_EDITOR_WIDTH}px wide</strong>.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Current width: <span className="font-medium text-blue-600">{windowWidth}px</span>
              </p>
              <div className="text-sm text-gray-500">
                <p>Try:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Resizing your browser window</li>
                  <li>• Using a desktop or laptop</li>
                  <li>• Rotating your device to landscape</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                The editor will automatically show when you reach the minimum width
              </p>
            </div>
          </div>
        </div>
      )}
      
      <LinkClickToast />
    </div>
  );
};

export default EditorPage;