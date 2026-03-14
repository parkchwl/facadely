"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaPlay, FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronRight,
  ChevronLeft,
  LayoutTemplate,
  Settings,
  SlidersHorizontal,
  Type,
  Box,
  Palette,
  Save,
  ShieldCheck,
  CheckCircle2,
  Rocket,
  FolderTree,
} from "lucide-react";
import {
  CustomFontAsset,
  cloneDefaultTypographyTokens,
  ThemeTokens,
  TypographyPreset,
  TypographyTokens,
} from "@/lib/site-customization-types";
import { EDITOR_FONT_OPTIONS, findEditorFontByFamily } from "@/lib/font-catalog";
import {
  applyCustomFontFaces,
  applyTypographyTokens,
  clearTypographyOverrides,
} from "@/lib/customization-runtime";
import {
  EditableStyleProperty,
  getAllowedStyleProperties,
  hasEditableField,
  TemplateEditableNode,
  TemplateEditableField,
  TemplateEditableKind,
  TemplateImagePreset,
  TemplateManifest,
  TemplateScenePreset,
} from "@/lib/template-manifest-types";
import { i18n } from "@/i18n/config";
import { isCanonicalTemplatePath } from "@/lib/user-site-store";

type Viewport = "desktop" | "tablet" | "mobile" | "responsive";

type HistoryAction = {
  type: 'style' | 'innerText' | 'theme' | 'attribute';
  elementRef?: HTMLElement;
  property?: string;
  oldValue: string;
  newValue: string;
};

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";
type ResizeSide = "left" | "right";

type Website = {
  id: string;
  name: string;
  desc: string;
  path: string;
};

type SaveableElementPatch = {
  editId: string;
  patch: {
    styles?: Record<string, string>;
    innerText?: string;
    src?: string;
    href?: string;
  };
};

type CanvasStructureNode = {
  editId: string;
  label: string;
  kind: TemplateEditableKind;
  tagName: string;
  children: CanvasStructureNode[];
};

type PublishState = {
  publicUrl: string;
  publishedSlug?: string;
  customDomain?: string | null;
  publishedAt?: string | null;
};

interface ViewportConfig {
  id: Viewport;
  name: string;
  icon: React.ElementType;
  width: string;
  height: string;
}

const VIEWPORTS: ViewportConfig[] = [
  { id: "desktop", name: "Desktop", icon: Monitor, width: "1920px", height: "1080px" },
  { id: "tablet", name: "Tablet", icon: Tablet, width: "768px", height: "1024px" },
  { id: "mobile", name: "Mobile", icon: Smartphone, width: "375px", height: "812px" },
  { id: "responsive", name: "Responsive", icon: Maximize, width: "100%", height: "100%" },
];

const CANVAS_HEADER_META: Record<Exclude<Viewport, "responsive">, {
  title: string;
  sizeLabel: string;
  icon: React.ElementType;
}> = {
  desktop: { title: "Desktop", sizeLabel: "1280px+", icon: Monitor },
  tablet: { title: "Tablet", sizeLabel: "768px - 1279px", icon: Tablet },
  mobile: { title: "Mobile", sizeLabel: "<768px", icon: Smartphone },
};

const WEBSITES: Website[] = [];

const EXCLUDED_SITE_PATH_PREFIXES = ["/t/"];

const normalizeSitePath = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }
  return withLeadingSlash;
};

const isExcludedWebsite = (site: Website) => {
  const path = normalizeSitePath(site.path);
  return EXCLUDED_SITE_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
};

const sanitizeWebsites = (sites: Website[]) => {
  const dedupedByPath = new Map<string, Website>();

  sites.forEach((site) => {
    const normalizedPath = normalizeSitePath(site.path);
    const normalized: Website = { ...site, path: normalizedPath };
    if (isExcludedWebsite(normalized)) return;
    if (!normalized.path) return;
    dedupedByPath.set(normalized.path, normalized);
  });

  return Array.from(dedupedByPath.values());
};

const DEFAULT_WEBSITES = sanitizeWebsites(WEBSITES);
const DEFAULT_ACTIVE_SITE: Website = DEFAULT_WEBSITES[0] ?? {
  id: "",
  name: "",
  desc: "",
  path: "",
};

const TOKEN_TO_CSS_VAR: Record<keyof ThemeTokens, string> = {
  primary: "--primary",
  secondary: "--secondary",
  radius: "--radius",
  spacingBase: "--spacing-base",
};

const LAYOUT_STORAGE_KEY = "facadely-editor-layout-v1";
const LEFT_PANEL_MIN_WIDTH = 240;
const LEFT_PANEL_MAX_WIDTH = 440;
const RIGHT_PANEL_MIN_WIDTH = 300;
const RIGHT_PANEL_MAX_WIDTH = 520;
const FONT_SIZE_MIN = 10;
const FONT_SIZE_MAX = 144;
const LINE_HEIGHT_MIN = 0.8;
const LINE_HEIGHT_MAX = 2.2;
const LETTER_SPACING_MIN = -2;
const LETTER_SPACING_MAX = 10;
const AUTO_SAVE_ENABLED = true;
const PREVIEW_SWITCH_DURATION_MS = 0;

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const readNumericValue = (value: string, fallback: number) => {
  const matched = value.match(/-?\d+(\.\d+)?/);
  if (!matched) return fallback;
  const numeric = Number(matched[0]);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toRounded = (value: number, digits: number) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const parseRgbString = (value: string): [number, number, number] | null => {
  const matched = value.match(/rgba?\(([^)]+)\)/i);
  if (!matched) return null;
  const parts = matched[1].split(",").map((part) => part.trim());
  if (parts.length < 3) return null;
  const rgb = parts.slice(0, 3).map((part) => Number(part));
  if (rgb.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)) {
    return null;
  }
  return rgb as [number, number, number];
};

const channelToHex = (value: number) => value.toString(16).padStart(2, "0");

const toColorInputValue = (value: string, fallback = "#111111") => {
  const trimmed = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const chars = trimmed.slice(1).split("");
    return `#${chars.map((char) => char + char).join("")}`;
  }
  const rgb = parseRgbString(trimmed);
  if (rgb) return `#${channelToHex(rgb[0])}${channelToHex(rgb[1])}${channelToHex(rgb[2])}`;
  return fallback;
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const normalized = toColorInputValue(hex, "");
  if (!/^#[0-9a-f]{6}$/i.test(normalized)) return null;
  const numeric = normalized.slice(1);
  return [
    parseInt(numeric.slice(0, 2), 16),
    parseInt(numeric.slice(2, 4), 16),
    parseInt(numeric.slice(4, 6), 16),
  ];
};

const srgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (rgb: [number, number, number]) => {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foregroundHex: string, backgroundHex: string) => {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);
  if (!fg || !bg) return null;
  const fgLum = relativeLuminance(fg);
  const bgLum = relativeLuminance(bg);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
};

const normalizeFontToken = (value: string) => value.split(",")[0].replace(/['"]/g, "").trim().toLowerCase();

const extractBackgroundImageUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "none") return "";
  const matched = trimmed.match(/url\((['"]?)(.*?)\1\)/i);
  if (!matched) return "";
  const raw = matched[2]?.trim() ?? "";
  if (!raw) return "";
  try {
    const parsed = new URL(raw, "http://localhost");
    if (parsed.protocol === "data:") return raw;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return raw;
  }
};

const normalizeBackgroundImageInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    /^url\(/i.test(trimmed) ||
    trimmed === "none" ||
    /^var\(/i.test(trimmed) ||
    /^(linear|radial)-gradient\(/i.test(trimmed)
  ) {
    return trimmed;
  }
  return `url("${trimmed}")`;
};

const normalizePresetPath = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.protocol === "data:") return trimmed;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return trimmed;
  }
};

function EditorContent() {
  const searchParams = useSearchParams();
  const [activeSite, setActiveSite] = useState<Website>(DEFAULT_ACTIVE_SITE);
  const [viewport, setViewport] = useState<ViewportConfig>(VIEWPORTS[0]);
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<"elements" | "theme">("elements");
  const [isMounting, setIsMounting] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [websites, setWebsites] = useState<Website[]>(DEFAULT_WEBSITES);

  // Styling state
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const selectedEditIdRef = useRef("");
  const [hasSelection, setHasSelection] = useState(false);
  const [elementType, setElementType] = useState<TemplateEditableKind | "unknown">("unknown");
  const [templateManifest, setTemplateManifest] = useState<TemplateManifest | null>(null);
  const templateManifestRef = useRef<TemplateManifest | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [selectedEditableNode, setSelectedEditableNode] = useState<TemplateEditableNode | null>(null);
  const [canvasStructure, setCanvasStructure] = useState<CanvasStructureNode[]>([]);

  const [styles, setStyles] = useState({
    innerText: "",
    href: "",
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    color: "",
    lineHeight: "",
    letterSpacing: "",
    src: "",
    backgroundColor: "",
    backgroundImage: "",
  });
  const [fontQuery, setFontQuery] = useState("");
  const [activeTypographyPreset, setActiveTypographyPreset] = useState<keyof TypographyTokens>("body");
  const [customFontFamilyInput, setCustomFontFamilyInput] = useState("");
  const [showAllImagePresets, setShowAllImagePresets] = useState(false);
  const [showAllScenePresets, setShowAllScenePresets] = useState(false);
  const fontUploadInputRef = useRef<HTMLInputElement>(null);
  const prefetchedImageUrlsRef = useRef<Set<string>>(new Set());

  // Global Theme Tokens State
  const [themeTokens, setThemeTokens] = useState({
    primary: "#6366f1",
    secondary: "#d946ef",
    radius: "0.5rem",
    spacingBase: "1rem"
  });
  const [typographyTokens, setTypographyTokens] = useState<TypographyTokens>(cloneDefaultTypographyTokens());
  const [typographyPresetEnabled, setTypographyPresetEnabled] = useState(false);
  const [customFonts, setCustomFonts] = useState<CustomFontAsset[]>([]);
  const [isUploadingFont, setIsUploadingFont] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishState, setPublishState] = useState<PublishState | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewSwitching, setIsPreviewSwitching] = useState(false);
  const [isPreviewPostEffectsReady, setIsPreviewPostEffectsReady] = useState(true);
  const isPreviewModeRef = useRef(false);
  const previewSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewPostEffectRafRef = useRef<number | null>(null);
  const previewPostEffectRaf2Ref = useRef<number | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [changeVersion, setChangeVersion] = useState(0);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [resizingSide, setResizingSide] = useState<ResizeSide | null>(null);
  const resizeSessionRef = useRef<{ side: ResizeSide; startX: number; startWidth: number } | null>(null);

  // Undo / Redo History State
  const [actionStack, setActionStack] = useState<HistoryAction[]>([]);
  const [actionIndex, setActionIndex] = useState(-1);
  const pendingActionRef = useRef<HistoryAction | null>(null);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasActiveSite = activeSite.path.trim().length > 0;

  const commitAction = useCallback((action: HistoryAction) => {
    setActionStack(prev => [...prev.slice(0, actionIndex + 1), action]);
    setActionIndex(prev => prev + 1);
  }, [actionIndex]);

  const pushAction = useCallback((action: HistoryAction) => {
    if (
      !pendingActionRef.current ||
      pendingActionRef.current.type !== action.type ||
      pendingActionRef.current.elementRef !== action.elementRef ||
      pendingActionRef.current.property !== action.property
    ) {
      if (pendingActionRef.current) commitAction(pendingActionRef.current);
      pendingActionRef.current = action;
    } else {
      pendingActionRef.current.newValue = action.newValue;
    }

    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      if (pendingActionRef.current) {
        commitAction(pendingActionRef.current);
        pendingActionRef.current = null;
      }
    }, 500);
  }, [commitAction]);

  const markEditorDirty = useCallback(() => {
    setChangeVersion(prev => prev + 1);
    setAutoSaveStatus(prev => (prev === "saving" ? prev : "idle"));
    setAutoSaveError(prev => (prev ? null : prev));
  }, []);

  const setStyleProperty = useCallback((element: HTMLElement, property: string, value: string) => {
    element.style.setProperty(
      property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`),
      value
    );
  }, []);

  const getStyleProperty = useCallback((element: HTMLElement, property: string) => {
    return element.style.getPropertyValue(property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`));
  }, []);

  const prefetchImageAsset = useCallback((url: string) => {
    const normalized = normalizePresetPath(url);
    if (!normalized) return;
    if (prefetchedImageUrlsRef.current.has(normalized)) return;
    prefetchedImageUrlsRef.current.add(normalized);
    if (typeof window === "undefined") return;
    const image = new window.Image();
    image.decoding = "async";
    image.src = normalized;
  }, []);

  const ensureFontLoaded = useCallback((fontFamilyValue: string) => {
    const matched = findEditorFontByFamily(fontFamilyValue);
    if (!matched?.googleHref) return;

    const linkId = `facadely-font-${matched.id}`;
    const attachLink = (doc: Document) => {
      if (!doc.head) return;
      if (doc.getElementById(linkId)) return;
      const link = doc.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = matched.googleHref!;
      doc.head.appendChild(link);
    };

    attachLink(document);
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    if (iframeDoc) attachLink(iframeDoc);
  }, []);

  const applyGlobalPreviewCustomization = useCallback((iframeDoc: Document) => {
    const baseCustomization = {
      sitePath: activeSite.path,
      themeTokens,
      typographyTokens,
      typographyPresetEnabled,
      customFonts,
      elements: [],
      updatedAt: new Date().toISOString(),
    };
    applyCustomFontFaces(iframeDoc, baseCustomization);
    if (typographyPresetEnabled) {
      applyTypographyTokens(iframeDoc, baseCustomization);
    } else {
      clearTypographyOverrides(iframeDoc);
    }
  }, [activeSite.path, customFonts, themeTokens, typographyPresetEnabled, typographyTokens]);

  const hasField = useCallback((field: TemplateEditableField): boolean => {
    if (!selectedEditableNode) return false;
    return hasEditableField(selectedEditableNode, field);
  }, [selectedEditableNode]);

  const getAllowedStyleSet = useCallback(
    (node: TemplateEditableNode | null): Set<EditableStyleProperty> => {
      if (!node) return new Set();
      return new Set(getAllowedStyleProperties(node.fields));
    },
    []
  );

  const collectEditableStyles = useCallback((element: HTMLElement, node: TemplateEditableNode | null) => {
    const patch: Record<string, string> = {};
    const allowedStyles = getAllowedStyleSet(node);
    for (const property of allowedStyles) {
      const value = element.style[property];
      if (typeof value === "string" && value.trim().length > 0) {
        patch[property] = value;
      }
    }
    return patch;
  }, [getAllowedStyleSet]);

  const collectAllEditablePatches = useCallback((): SaveableElementPatch[] => {
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    const manifest = templateManifestRef.current;
    if (!iframeDoc || !manifest) {
      return [];
    }

    return manifest.editable.flatMap((node) => {
      const escapedEditId =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(node.editId)
          : node.editId;
      const element = iframeDoc.querySelector<HTMLElement>(`[data-edit-id="${escapedEditId}"]`);
      if (!element) {
        return [];
      }

      const patch: SaveableElementPatch["patch"] = {};
      const styles = collectEditableStyles(element, node);
      if (Object.keys(styles).length > 0) {
        patch.styles = styles;
      }

      if (hasEditableField(node, "text")) {
        patch.innerText = element.innerText;
      }

      if (hasEditableField(node, "image") && element.tagName.toLowerCase() === "img") {
        const imageSrc = (element as HTMLImageElement).src;
        if (imageSrc) {
          patch.src = imageSrc;
        }
      }

      if (hasEditableField(node, "button") && element.tagName.toLowerCase() === "a") {
        const href = element.getAttribute("href") ?? "";
        if (href) {
          patch.href = href;
        }
      }

      if (!patch.styles && patch.innerText === undefined && !patch.src && !patch.href) {
        return [];
      }

      return [{ editId: node.editId, patch }];
    });
  }, [collectEditableStyles]);

  const applyAction = useCallback((action: HistoryAction, isUndo: boolean) => {
    const val = isUndo ? action.oldValue : action.newValue;

    if (action.type === 'style' && action.elementRef && action.property) {
      setStyleProperty(action.elementRef, action.property, val);
      if (selectedElementRef.current === action.elementRef) {
        const nextValue = action.property === "backgroundImage"
          ? extractBackgroundImageUrl(val)
          : val;
        setStyles(prev => ({ ...prev, [action.property!]: nextValue }));
      }
    } else if (action.type === 'innerText' && action.elementRef) {
      action.elementRef.innerText = val;
      if (selectedElementRef.current === action.elementRef) {
        setStyles(prev => ({ ...prev, innerText: val }));
      }
    } else if (action.type === 'attribute' && action.elementRef && action.property) {
      const tagName = action.elementRef.tagName.toLowerCase();
      if (action.property === "src" && tagName === "img") {
        (action.elementRef as HTMLImageElement).src = val;
      } else if (action.property === "href" && tagName === "a") {
        action.elementRef.setAttribute("href", val);
      } else {
        action.elementRef.setAttribute(action.property, val);
      }
      if (selectedElementRef.current === action.elementRef) {
        setStyles(prev => ({ ...prev, [action.property!]: val }));
      }
    } else if (action.type === 'theme' && action.property) {
      setThemeTokens(prev => ({ ...prev, [action.property!]: val }));
      const iframeDoc = iframeRef.current?.contentWindow?.document;
      if (iframeDoc) {
        const token = action.property as keyof ThemeTokens;
        const cssVar = TOKEN_TO_CSS_VAR[token];
        if (cssVar) iframeDoc.documentElement.style.setProperty(cssVar, val);
      }
    }
    markEditorDirty();
  }, [markEditorDirty, setStyleProperty]);

  useEffect(() => {
    isPreviewModeRef.current = isPreviewMode;
  }, [isPreviewMode]);

  useEffect(() => {
    templateManifestRef.current = templateManifest;
  }, [templateManifest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreviewModeRef.current) {
        e.preventDefault();
        setIsPreviewMode(false);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          // Redo
          e.preventDefault();
          if (actionIndex < actionStack.length - 1) {
            const nextAction = actionStack[actionIndex + 1];
            applyAction(nextAction, false);
            setActionIndex(prev => prev + 1);
          }
        } else {
          // Undo
          e.preventDefault();
          if (actionIndex >= 0) {
            const prevAction = actionStack[actionIndex];
            applyAction(prevAction, true);
            setActionIndex(prev => prev - 1);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actionStack, actionIndex, applyAction]);

  useEffect(() => {
    try {
      const savedLayout = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout) as {
          leftPanelWidth?: number;
          rightPanelWidth?: number;
          isSidebarOpen?: boolean;
          zoom?: number;
          viewportId?: Viewport;
        };

        if (typeof parsed.leftPanelWidth === "number") {
          setLeftPanelWidth(clampNumber(parsed.leftPanelWidth, LEFT_PANEL_MIN_WIDTH, LEFT_PANEL_MAX_WIDTH));
        }
        if (typeof parsed.rightPanelWidth === "number") {
          setRightPanelWidth(clampNumber(parsed.rightPanelWidth, RIGHT_PANEL_MIN_WIDTH, RIGHT_PANEL_MAX_WIDTH));
        }
        if (typeof parsed.isSidebarOpen === "boolean") {
          setIsSidebarOpen(parsed.isSidebarOpen);
        }
        if (typeof parsed.zoom === "number") {
          setZoom(clampNumber(parsed.zoom, 25, 200));
        }
        if (parsed.viewportId) {
          const persistedViewport = VIEWPORTS.find(vp => vp.id === parsed.viewportId);
          if (persistedViewport) {
            setViewport(persistedViewport);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to restore editor layout:", err);
    }

    setIsMounting(false);

    const controller = new AbortController();

    fetch("/api/pages", { cache: "no-store", signal: controller.signal })
      .then((res) => res.json())
      .then((data: { pages?: Website[] }) => {
        const incomingPages = data.pages ?? [];
        if (incomingPages.length > 0) {
          setWebsites(sanitizeWebsites(incomingPages));
        } else {
          setWebsites([]);
        }
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.warn(error);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setWebsites((prev) => sanitizeWebsites(prev));
  }, []);

  useEffect(() => {
    if (websites.length === 0) {
      if (activeSite.path) {
        setActiveSite(DEFAULT_ACTIVE_SITE);
      }
      return;
    }
    const matched = websites.find((site) => site.path === activeSite.path);
    if (!matched) {
      setActiveSite(websites[0]);
    }
  }, [activeSite.path, websites]);

  useEffect(() => {
    if (isMounting) return;
    try {
      window.localStorage.setItem(
        LAYOUT_STORAGE_KEY,
        JSON.stringify({
          leftPanelWidth,
          rightPanelWidth,
          isSidebarOpen,
          zoom,
          viewportId: viewport.id,
        })
      );
    } catch (err) {
      console.warn("Failed to persist editor layout:", err);
    }
  }, [isMounting, isSidebarOpen, leftPanelWidth, rightPanelWidth, viewport.id, zoom]);

  useEffect(() => {
    if (!resizingSide) return;

    const handlePointerMove = (event: MouseEvent) => {
      const session = resizeSessionRef.current;
      if (!session) return;

      if (session.side === "left") {
        const nextWidth = clampNumber(
          session.startWidth + (event.clientX - session.startX),
          LEFT_PANEL_MIN_WIDTH,
          LEFT_PANEL_MAX_WIDTH
        );
        setLeftPanelWidth(nextWidth);
      } else {
        const nextWidth = clampNumber(
          session.startWidth + (session.startX - event.clientX),
          RIGHT_PANEL_MIN_WIDTH,
          RIGHT_PANEL_MAX_WIDTH
        );
        setRightPanelWidth(nextWidth);
      }
    };

    const handlePointerUp = () => {
      setResizingSide(null);
      resizeSessionRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [resizingSide]);

  useEffect(() => {
    setAutoSaveStatus("idle");
    setAutoSaveError(null);
    setLastSavedAt(null);
    setChangeVersion(0);
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
    setTemplateManifest(null);
    setManifestError(null);
    selectedElementRef.current = null;
    selectedEditIdRef.current = "";
    setHasSelection(false);
    setSelectedEditableNode(null);
    setCanvasStructure([]);
    setElementType("unknown");
    setIsPropertyPanelOpen(false);
    setTypographyTokens(cloneDefaultTypographyTokens());
    setTypographyPresetEnabled(false);
    setCustomFonts([]);
    setCustomFontFamilyInput("");
  }, [activeSite.path]);

  useEffect(() => {
    if (!activeSite.path) {
      setTemplateManifest(null);
      setManifestError(null);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/template-manifest?sitePath=${encodeURIComponent(activeSite.path)}`, {
      signal: controller.signal,
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Template manifest not found"))
      )
      .then((data: { manifest?: TemplateManifest }) => {
        if (controller.signal.aborted) return;
        if (!data.manifest) {
          throw new Error("Template manifest not found");
        }
        setTemplateManifest(data.manifest);
        setManifestError(null);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setTemplateManifest(null);
        setManifestError(error instanceof Error ? error.message : "Template manifest unavailable");
      });

    return () => {
      controller.abort();
    };
  }, [activeSite.path]);

  useEffect(() => {
    if (!activeSite.path) {
      setThemeTokens({
        primary: "#6366f1",
        secondary: "#d946ef",
        radius: "0.5rem",
        spacingBase: "1rem",
      });
      setTypographyTokens(cloneDefaultTypographyTokens());
      setTypographyPresetEnabled(false);
      setCustomFonts([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/save-code?sitePath=${encodeURIComponent(activeSite.path)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: {
        customization?: {
          themeTokens?: ThemeTokens;
          typographyTokens?: TypographyTokens;
          typographyPresetEnabled?: boolean;
          customFonts?: CustomFontAsset[];
        };
      } | null) => {
        if (controller.signal.aborted) return;
        if (!data?.customization) return;
        if (data.customization.themeTokens) {
          setThemeTokens(data.customization.themeTokens);
        }
        if (data.customization.typographyTokens) {
          setTypographyTokens(data.customization.typographyTokens);
        } else {
          setTypographyTokens(cloneDefaultTypographyTokens());
        }
        setTypographyPresetEnabled(data.customization.typographyPresetEnabled === true);
        if (Array.isArray(data.customization.customFonts)) {
          setCustomFonts(data.customization.customFonts);
        } else {
          setCustomFonts([]);
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn(error);
      });

    return () => {
      controller.abort();
    };
  }, [activeSite.path]);

  useEffect(() => {
    if (!activeSite.path) return;
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    const root = iframeDoc?.documentElement;
    if (!iframeDoc || !root) return;
    root.style.setProperty(TOKEN_TO_CSS_VAR.primary, themeTokens.primary);
    root.style.setProperty(TOKEN_TO_CSS_VAR.secondary, themeTokens.secondary);
    root.style.setProperty(TOKEN_TO_CSS_VAR.radius, themeTokens.radius);
    root.style.setProperty(TOKEN_TO_CSS_VAR.spacingBase, themeTokens.spacingBase);
    applyGlobalPreviewCustomization(iframeDoc);
  }, [activeSite.path, applyGlobalPreviewCustomization, themeTokens]);

  useEffect(() => {
    if (!activeSite.path) return;
    ensureFontLoaded(typographyTokens.heading.fontFamily);
    ensureFontLoaded(typographyTokens.body.fontFamily);
    ensureFontLoaded(typographyTokens.button.fontFamily);
    applyCustomFontFaces(document, {
      sitePath: activeSite.path,
      themeTokens,
      typographyTokens,
      typographyPresetEnabled,
      customFonts,
      elements: [],
      updatedAt: new Date().toISOString(),
    });
  }, [activeSite.path, customFonts, ensureFontLoaded, themeTokens, typographyPresetEnabled, typographyTokens]);

  useEffect(() => {
    if (autoSaveStatus !== "saved") return;
    const timeout = setTimeout(() => {
      setAutoSaveStatus("idle");
    }, 2200);
    return () => clearTimeout(timeout);
  }, [autoSaveStatus]);

  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
      if (previewSwitchTimeoutRef.current) clearTimeout(previewSwitchTimeoutRef.current);
      if (previewPostEffectRafRef.current) cancelAnimationFrame(previewPostEffectRafRef.current);
      if (previewPostEffectRaf2Ref.current) cancelAnimationFrame(previewPostEffectRaf2Ref.current);
    };
  }, []);

  useEffect(() => {
    if (!styles.fontFamily) return;
    ensureFontLoaded(styles.fontFamily);
  }, [ensureFontLoaded, styles.fontFamily]);

  useEffect(() => {
    setShowAllImagePresets(false);
    setShowAllScenePresets(false);
  }, [activeSite.path, selectedEditableNode?.editId]);

  const clearSelection = useCallback(() => {
    if (selectedElementRef.current) {
      selectedElementRef.current.style.outline = selectedElementRef.current.dataset.origOutline || "";
      selectedElementRef.current.style.outlineOffset = selectedElementRef.current.dataset.origOutlineOffset || "";
      selectedElementRef.current.style.boxShadow = selectedElementRef.current.dataset.origBoxShadow || "";
      selectedElementRef.current.style.cursor = selectedElementRef.current.dataset.origCursor || "";
      selectedElementRef.current.contentEditable = "false";
    }
    selectedElementRef.current = null;
    selectedEditIdRef.current = "";
    setHasSelection(false);
    setSelectedEditableNode(null);
    setElementType("unknown");
    setFontQuery("");
  }, []);

  useEffect(() => {
    const requestedSitePath = normalizeSitePath(searchParams.get("sitePath") ?? "");
    if (!requestedSitePath) return;

    const matched = websites.find((site) => site.path === requestedSitePath);
    if (!matched || matched.path === activeSite.path) {
      return;
    }

    clearSelection();
    setActiveSite(matched);
  }, [activeSite.path, clearSelection, searchParams, websites]);

  const selectEditableElement = useCallback((editableTarget: HTMLElement, editableNode: TemplateEditableNode) => {
    if (editableTarget.isContentEditable) return;

    clearSelection();

    editableTarget.dataset.origOutline = editableTarget.style.outline;
    editableTarget.dataset.origOutlineOffset = editableTarget.style.outlineOffset;
    editableTarget.dataset.origBoxShadow = editableTarget.style.boxShadow;
    editableTarget.dataset.origCursor = editableTarget.style.cursor;

    editableTarget.style.outline = "2px solid #22c55e";
    editableTarget.style.outlineOffset = "2px";
    editableTarget.classList.remove("ag-editor-hover");

    selectedElementRef.current = editableTarget;
    selectedEditIdRef.current = editableNode.editId;
    setSelectedEditableNode(editableNode);
    setElementType(editableNode.kind);
    setHasSelection(true);
    setActivePanelTab("elements");

    const computedStyles = iframeRef.current?.contentWindow?.getComputedStyle(editableTarget);
    if (computedStyles) {
      ensureFontLoaded(computedStyles.fontFamily);
      const targetTag = editableTarget.tagName.toLowerCase();
      setStyles({
        innerText: editableTarget.innerText || "",
        href: targetTag === "a" ? (editableTarget.getAttribute("href") ?? "") : "",
        fontFamily: computedStyles.fontFamily,
        fontSize: computedStyles.fontSize,
        fontWeight: computedStyles.fontWeight,
        color: computedStyles.color,
        lineHeight: computedStyles.lineHeight,
        letterSpacing: computedStyles.letterSpacing,
        src: targetTag === "img" ? (editableTarget as HTMLImageElement).src : "",
        backgroundColor: computedStyles.backgroundColor,
        backgroundImage: extractBackgroundImageUrl(computedStyles.backgroundImage),
      });
    }

    setIsPropertyPanelOpen(true);
  }, [clearSelection, ensureFontLoaded]);

  const focusEditableById = useCallback((editId: string) => {
    if (!editId || isPreviewModeRef.current) return;
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    const manifest = templateManifestRef.current;
    if (!iframeDoc || !manifest) return;

    const editableNode = manifest.editable.find((item) => item.editId === editId);
    if (!editableNode) return;

    const escapedEditId = typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(editId)
      : editId;
    const editableTarget = iframeDoc.querySelector<HTMLElement>(`[data-edit-id="${escapedEditId}"]`);
    if (!editableTarget) return;

    selectEditableElement(editableTarget, editableNode);
    editableTarget.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  }, [selectEditableElement]);

  const buildCanvasStructure = useCallback(() => {
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    const manifest = templateManifestRef.current;
    if (!iframeDoc || !manifest) {
      setCanvasStructure([]);
      return;
    }

    const editableById = new Map(manifest.editable.map((node) => [node.editId, node]));
    const orderedTargets: Array<{ editId: string; element: HTMLElement }> = [];
    const seen = new Set<string>();

    for (const element of Array.from(iframeDoc.querySelectorAll<HTMLElement>("[data-edit-id]"))) {
      const editId = element.dataset.editId?.trim() ?? "";
      if (!editId || !editableById.has(editId) || seen.has(editId)) continue;
      seen.add(editId);
      orderedTargets.push({ editId, element });
    }

    if (orderedTargets.length === 0) {
      setCanvasStructure([]);
      return;
    }

    const treeById = new Map<string, CanvasStructureNode>();
    for (const target of orderedTargets) {
      const node = editableById.get(target.editId)!;
      treeById.set(target.editId, {
        editId: target.editId,
        label: node.label,
        kind: node.kind,
        tagName: target.element.tagName.toLowerCase(),
        children: [],
      });
    }

    const roots: CanvasStructureNode[] = [];
    for (const target of orderedTargets) {
      const current = treeById.get(target.editId);
      if (!current) continue;

      let parentElement = target.element.parentElement?.closest<HTMLElement>("[data-edit-id]") ?? null;
      let parentId = parentElement?.dataset.editId?.trim() ?? "";
      while (parentElement && parentId && !treeById.has(parentId)) {
        parentElement = parentElement.parentElement?.closest<HTMLElement>("[data-edit-id]") ?? null;
        parentId = parentElement?.dataset.editId?.trim() ?? "";
      }

      if (parentId && treeById.has(parentId)) {
        treeById.get(parentId)!.children.push(current);
      } else {
        roots.push(current);
      }
    }

    setCanvasStructure(roots);
  }, []);

  useEffect(() => {
    buildCanvasStructure();
  }, [buildCanvasStructure, templateManifest]);

  const handleIframeLoad = () => {
    if (!iframeRef.current) return;
    try {
      const iframeWindow = iframeRef.current.contentWindow;
      const iframeDoc = iframeWindow?.document;
      if (!iframeDoc || !iframeWindow) return;

      const asIframeHTMLElement = (target: EventTarget | null): HTMLElement | null => {
        if (!target || typeof (target as Node).nodeType !== "number") return null;
        const node = target as Node;
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        const element = node as Element;
        if (typeof (element as HTMLElement).style !== "undefined") {
          return element as HTMLElement;
        }
        return element.parentElement;
      };

      // Sync initial theme tokens down to iframe
      const root = iframeDoc.documentElement;
      root.style.setProperty(TOKEN_TO_CSS_VAR.primary, themeTokens.primary);
      root.style.setProperty(TOKEN_TO_CSS_VAR.secondary, themeTokens.secondary);
      root.style.setProperty(TOKEN_TO_CSS_VAR.radius, themeTokens.radius);
      root.style.setProperty(TOKEN_TO_CSS_VAR.spacingBase, themeTokens.spacingBase);
      applyGlobalPreviewCustomization(iframeDoc);

      const styleId = "antigravity-editor-styles";
      if (!iframeDoc.getElementById(styleId)) {
        const style = iframeDoc.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          html, body {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }
          .ag-editor-hover {
            outline: 2px dashed rgba(99, 102, 241, 0.5) !important;
            outline-offset: 2px !important;
            cursor: default !important;
          }
          [contenteditable="true"]:focus {
            outline: 2px solid rgba(34, 197, 94, 0.8) !important;
            outline-offset: 2px !important;
            cursor: text !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      }

      iframeDoc.addEventListener("click", (e) => {
        if (isPreviewModeRef.current) return;

        const target = asIframeHTMLElement(e.target);
        if (!target) return;

        if (target === iframeDoc.body || target === iframeDoc.documentElement) {
          clearSelection();
          setIsPropertyPanelOpen(false);
          return;
        }
        const editableTarget = target.closest<HTMLElement>("[data-edit-id]");
        const editId = editableTarget?.dataset.editId?.trim() || "";
        const manifest = templateManifestRef.current;
        const editableNode = editId ? manifest?.editable.find((item) => item.editId === editId) : undefined;

        if (!editableTarget || !editableNode) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        selectEditableElement(editableTarget, editableNode);
      }, true);

      iframeDoc.addEventListener("dblclick", (e) => {
        if (isPreviewModeRef.current) return;

        const target = asIframeHTMLElement(e.target);
        if (!target) return;

        const editableTarget = target.closest<HTMLElement>("[data-edit-id]");
        const editId = editableTarget?.dataset.editId?.trim() || "";
        if (!editableTarget || !editId) return;
        const manifest = templateManifestRef.current;
        const editableNode = manifest?.editable.find((item) => item.editId === editId);
        if (!editableNode || !hasEditableField(editableNode, "text")) return;

        if (selectedElementRef.current === editableTarget) {
          e.preventDefault();
          const originalText = editableTarget.innerText;
          editableTarget.contentEditable = "true";
          editableTarget.focus();
          const handleInput = () => {
            const nextValue = editableTarget.innerText;
            setStyles((prev) => ({ ...prev, innerText: nextValue }));
            markEditorDirty();
          };
          const handleStopEdit = () => {
            editableTarget.contentEditable = "false";
            editableTarget.removeEventListener("input", handleInput);
            editableTarget.removeEventListener("blur", handleStopEdit);
            const newValue = editableTarget.innerText;
            if (originalText !== newValue) {
              pushAction({
                type: "innerText",
                elementRef: editableTarget,
                property: "innerText",
                oldValue: originalText,
                newValue: newValue
              });
              setStyles(prev => ({ ...prev, innerText: newValue }));
            }
          };
          editableTarget.addEventListener("input", handleInput);
          editableTarget.addEventListener("blur", handleStopEdit);
        }
      });

      iframeDoc.addEventListener("mouseover", (e) => {
        if (isPreviewModeRef.current) return;

        const target = asIframeHTMLElement(e.target);
        if (!target) return;
        if (target === iframeDoc.body || target === iframeDoc.documentElement) return;
        const editableTarget = target.closest<HTMLElement>("[data-edit-id]");
        if (!editableTarget) return;
        const editId = editableTarget.dataset.editId?.trim() || "";
        const manifest = templateManifestRef.current;
        if (!editId || !manifest?.editable.some((item) => item.editId === editId)) return;
        if (editableTarget !== selectedElementRef.current && !editableTarget.isContentEditable) {
          editableTarget.classList.add("ag-editor-hover");
        }
      }, true);

      iframeDoc.addEventListener("mouseout", (e) => {
        if (isPreviewModeRef.current) return;

        const target = asIframeHTMLElement(e.target);
        if (!target) return;
        const editableTarget = target.closest<HTMLElement>("[data-edit-id]");
        if (!editableTarget) return;
        editableTarget.classList.remove("ag-editor-hover");
      }, true);

      iframeDoc.addEventListener("dragstart", (e) => e.preventDefault(), true);
      buildCanvasStructure();

    } catch (err) {
      console.warn("Could not access iframe contents:", err);
    }
  };

  const updateStyle = useCallback((property: string, value: string) => {
    if (!selectedElementRef.current || !selectedEditableNode) return;

    const styleProperty = property as EditableStyleProperty;
    const allowedStyles = getAllowedStyleSet(selectedEditableNode);
    const normalizedValue = property === "backgroundImage"
      ? normalizeBackgroundImageInput(value)
      : value;
    if (property === "innerText" && !hasField("text")) return;
    if (property === "src" && !hasField("image")) return;
    if (property === "href" && !hasField("button")) return;
    if (!["innerText", "src", "href"].includes(property) && !allowedStyles.has(styleProperty)) return;

    // For Undo tracking
    let oldValue = '';
    if (property === 'innerText') {
      oldValue = selectedElementRef.current.innerText || '';
    } else if (property === 'src' && selectedElementRef.current.tagName.toLowerCase() === 'img') {
      oldValue = (selectedElementRef.current as HTMLImageElement).src || '';
    } else if (property === "href" && selectedElementRef.current.tagName.toLowerCase() === "a") {
      oldValue = selectedElementRef.current.getAttribute("href") ?? "";
    } else {
      oldValue = getStyleProperty(selectedElementRef.current, property) || '';
    }

    pushAction({
      type: property === "innerText" ? "innerText" : property === "src" || property === "href" ? "attribute" : "style",
      elementRef: selectedElementRef.current,
      property,
      oldValue,
      newValue: normalizedValue
    });

    if (property === 'innerText') {
      selectedElementRef.current.innerText = normalizedValue;
      setStyles(prev => ({ ...prev, innerText: normalizedValue }));
      markEditorDirty();
      return;
    }
    if (property === 'src' && selectedElementRef.current.tagName.toLowerCase() === 'img') {
      (selectedElementRef.current as HTMLImageElement).src = normalizedValue;
      setStyles(prev => ({ ...prev, src: normalizedValue }));
      markEditorDirty();
      return;
    }
    if (property === "href" && selectedElementRef.current.tagName.toLowerCase() === "a") {
      selectedElementRef.current.setAttribute("href", normalizedValue);
      setStyles(prev => ({ ...prev, href: normalizedValue }));
      markEditorDirty();
      return;
    }
    if (property === "fontFamily") {
      ensureFontLoaded(normalizedValue);
    }
    setStyleProperty(
      selectedElementRef.current,
      property,
      normalizedValue
    );
    const nextStateValue = property === "backgroundImage"
      ? extractBackgroundImageUrl(normalizedValue)
      : normalizedValue;
    setStyles((prev) => ({ ...prev, [property]: nextStateValue }));
    markEditorDirty();
  }, [
    ensureFontLoaded,
    getAllowedStyleSet,
    getStyleProperty,
    hasField,
    markEditorDirty,
    pushAction,
    selectedEditableNode,
    setStyleProperty,
  ]);

  const updateThemeToken = (token: keyof typeof themeTokens, value: string) => {
    const oldValue = themeTokens[token];
    pushAction({
      type: 'theme',
      property: token,
      oldValue,
      newValue: value
    });

    setThemeTokens(prev => ({ ...prev, [token]: value }));
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.documentElement.style.setProperty(TOKEN_TO_CSS_VAR[token], value);
    }
    markEditorDirty();
  };

  const updateTypographyPresetEnabled = useCallback((enabled: boolean) => {
    setTypographyPresetEnabled(enabled);
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    if (iframeDoc) {
      if (enabled) {
        applyGlobalPreviewCustomization(iframeDoc);
      } else {
        clearTypographyOverrides(iframeDoc);
      }
    }
    markEditorDirty();
  }, [applyGlobalPreviewCustomization, markEditorDirty]);

  const updateTypographyPreset = useCallback(
    (preset: keyof TypographyTokens, field: keyof TypographyPreset, value: string) => {
      setTypographyTokens((prev) => {
        const next: TypographyTokens = {
          ...prev,
          [preset]: {
            ...prev[preset],
            [field]: value,
          },
        };
        return next;
      });
      if (field === "fontFamily") {
        ensureFontLoaded(value);
      }
      const iframeDoc = iframeRef.current?.contentWindow?.document;
      if (iframeDoc) {
        const baseCustomization = {
          sitePath: activeSite.path,
          themeTokens,
          typographyTokens: {
            ...typographyTokens,
            [preset]: {
              ...typographyTokens[preset],
              [field]: value,
            },
          },
          typographyPresetEnabled,
          customFonts,
          elements: [],
          updatedAt: new Date().toISOString(),
        };
        applyCustomFontFaces(iframeDoc, baseCustomization);
        if (typographyPresetEnabled) {
          applyTypographyTokens(iframeDoc, baseCustomization);
        } else {
          clearTypographyOverrides(iframeDoc);
        }
      }
      markEditorDirty();
    },
    [
      activeSite.path,
      customFonts,
      ensureFontLoaded,
      markEditorDirty,
      themeTokens,
      typographyPresetEnabled,
      typographyTokens,
    ]
  );

  const handleUploadCustomFont = useCallback(async (file: File) => {
    const fallbackFamily = file.name.replace(/\.woff2$/i, "").replace(/[-_]+/g, " ").trim();
    const family = customFontFamilyInput.trim() || fallbackFamily;
    if (!family) {
      alert("Enter a font family name before uploading.");
      return;
    }

    setIsUploadingFont(true);
    try {
      const form = new FormData();
      form.set("sitePath", activeSite.path);
      form.set("family", family);
      form.set("file", file);

      const res = await fetch("/api/fonts/upload", {
        method: "POST",
        body: form,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error ?? "Failed to upload font");
      }

      const uploaded = payload?.font as { family?: string; url?: string } | undefined;
      if (!uploaded?.family || !uploaded?.url) {
        throw new Error("Invalid upload response");
      }

      const uploadedFont: CustomFontAsset = {
        family: uploaded.family,
        url: uploaded.url,
        uploadedAt: new Date().toISOString(),
      };
      setCustomFonts((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.family.toLowerCase() === uploadedFont.family.toLowerCase()
        );
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = uploadedFont;
          return next;
        }
        return [...prev, uploadedFont];
      });

      const fontFamilyValue = `"${uploaded.family}", sans-serif`;
      setCustomFontFamilyInput(uploaded.family);
      updateTypographyPreset(activeTypographyPreset, "fontFamily", fontFamilyValue);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload custom font";
      alert(message);
    } finally {
      setIsUploadingFont(false);
      if (fontUploadInputRef.current) {
        fontUploadInputRef.current.value = "";
      }
    }
  }, [activeSite.path, activeTypographyPreset, customFontFamilyInput, updateTypographyPreset]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 25));
  const handleZoomReset = () => setZoom(100);

  const handleTogglePreview = () => {
    if (!hasActiveSite && !isPreviewModeRef.current) {
      return;
    }

    const enteringPreview = !isPreviewModeRef.current;

    if (previewSwitchTimeoutRef.current) {
      clearTimeout(previewSwitchTimeoutRef.current);
      previewSwitchTimeoutRef.current = null;
    }
    if (previewPostEffectRafRef.current) {
      cancelAnimationFrame(previewPostEffectRafRef.current);
      previewPostEffectRafRef.current = null;
    }
    if (previewPostEffectRaf2Ref.current) {
      cancelAnimationFrame(previewPostEffectRaf2Ref.current);
      previewPostEffectRaf2Ref.current = null;
    }

    setIsPreviewSwitching(true);

    if (enteringPreview) {
      clearSelection();
      setIsPropertyPanelOpen(false);
      setIsPreviewPostEffectsReady(false);
      setIsPreviewMode(true);
      // Stage 2: non-critical preview chrome appears after first paint.
      previewPostEffectRafRef.current = requestAnimationFrame(() => {
        previewPostEffectRaf2Ref.current = requestAnimationFrame(() => {
          setIsPreviewPostEffectsReady(true);
          previewPostEffectRaf2Ref.current = null;
        });
        previewPostEffectRafRef.current = null;
      });
    } else {
      setIsPreviewPostEffectsReady(true);
      setIsPreviewMode(false);
    }

    previewSwitchTimeoutRef.current = setTimeout(() => {
      setIsPreviewSwitching(false);
      previewSwitchTimeoutRef.current = null;
    }, PREVIEW_SWITCH_DURATION_MS);
  };

  const handleResizeStart = useCallback((side: ResizeSide) => (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    resizeSessionRef.current = {
      side,
      startX: event.clientX,
      startWidth: side === "left" ? leftPanelWidth : rightPanelWidth,
    };
    setResizingSide(side);
  }, [leftPanelWidth, rightPanelWidth]);

  const persistPatchByEditId = useCallback(async (
    editId: string,
    patch: {
      styles?: Record<string, string>;
      innerText?: string;
      src?: string;
      href?: string;
    }
  ) => {
    const res = await fetch("/api/save-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sitePath: activeSite.path,
        editId,
        patch,
      }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.error ?? `Failed to save patch for ${editId}`);
    }
  }, [activeSite.path]);

  const applyScenePreset = useCallback(async (scene: TemplateScenePreset) => {
    const iframeDoc = iframeRef.current?.contentWindow?.document;
    const manifest = templateManifestRef.current;
    if (!iframeDoc || !manifest) return;

    setIsSaving(true);
    setAutoSaveError(null);

    try {
      for (const scenePatch of scene.patches) {
        const editableNode = manifest.editable.find((node) => node.editId === scenePatch.editId);
        if (!editableNode) continue;
        const escapedEditId =
          typeof CSS !== "undefined" && typeof CSS.escape === "function"
            ? CSS.escape(scenePatch.editId)
            : scenePatch.editId;
        const target = iframeDoc.querySelector<HTMLElement>(`[data-edit-id="${escapedEditId}"]`);
        if (!target) continue;

        const allowedStyles = getAllowedStyleSet(editableNode);
        const patchStyles: Record<string, string> = {};

        if (scenePatch.styles && typeof scenePatch.styles === "object") {
          for (const [property, rawValue] of Object.entries(scenePatch.styles)) {
            if (typeof rawValue !== "string") continue;
            if (!allowedStyles.has(property as EditableStyleProperty)) continue;
            const normalizedValue = property === "backgroundImage"
              ? normalizeBackgroundImageInput(rawValue)
              : rawValue;
            patchStyles[property] = normalizedValue;
          }
        }

        for (const [property, normalizedValue] of Object.entries(patchStyles)) {
          setStyleProperty(target, property, normalizedValue);
          if (property === "fontFamily") {
            ensureFontLoaded(normalizedValue);
          }
          if (selectedElementRef.current === target) {
            const nextValue = property === "backgroundImage"
              ? extractBackgroundImageUrl(normalizedValue)
              : normalizedValue;
            setStyles((prev) => ({ ...prev, [property]: nextValue }));
          }
        }

        const patchPayload: {
          styles?: Record<string, string>;
          innerText?: string;
          src?: string;
          href?: string;
        } = {};

        if (Object.keys(patchStyles).length > 0) {
          patchPayload.styles = patchStyles;
        }

        if (typeof scenePatch.innerText === "string" && hasEditableField(editableNode, "text")) {
          target.innerText = scenePatch.innerText;
          patchPayload.innerText = scenePatch.innerText;
          if (selectedElementRef.current === target) {
            setStyles((prev) => ({ ...prev, innerText: scenePatch.innerText! }));
          }
        }

        if (typeof scenePatch.src === "string" && hasEditableField(editableNode, "image")) {
          const tagName = target.tagName.toLowerCase();
          if (tagName === "img") {
            (target as HTMLImageElement).src = scenePatch.src;
            patchPayload.src = scenePatch.src;
            if (selectedElementRef.current === target) {
              setStyles((prev) => ({ ...prev, src: scenePatch.src! }));
            }
          }
        }

        if (typeof scenePatch.href === "string" && hasEditableField(editableNode, "button")) {
          const tagName = target.tagName.toLowerCase();
          if (tagName === "a") {
            target.setAttribute("href", scenePatch.href);
            patchPayload.href = scenePatch.href;
            if (selectedElementRef.current === target) {
              setStyles((prev) => ({ ...prev, href: scenePatch.href! }));
            }
          }
        }

        if (patchPayload.styles || patchPayload.innerText || patchPayload.src || patchPayload.href) {
          await persistPatchByEditId(scenePatch.editId, patchPayload);
        }
      }

      markEditorDirty();
      setLastSavedAt(new Date());
      setAutoSaveStatus("saved");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to apply scene preset";
      setAutoSaveStatus("error");
      setAutoSaveError(message);
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }, [ensureFontLoaded, getAllowedStyleSet, markEditorDirty, persistPatchByEditId, setStyleProperty]);

  const saveToDataStore = useCallback(async (mode: "manual" | "auto" = "manual") => {
    if (mode === "auto" && !AUTO_SAVE_ENABLED) {
      return false;
    }

    if (!activeSite.path) {
      if (mode === "manual") {
        alert("Create or select a site before saving.");
      }
      return false;
    }

    if (!templateManifestRef.current) {
      if (mode === "manual") {
        alert("Template manifest is still loading. Please try again in a moment.");
      }
      return false;
    }

    const elementPatches = collectAllEditablePatches();

    setIsSaving(true);
    setAutoSaveError(null);
    if (mode === "auto") {
      setAutoSaveStatus("saving");
    }

    try {
      const requestBody: Record<string, unknown> = {
        sitePath: activeSite.path,
        themeTokens,
        typographyTokens,
        typographyPresetEnabled,
      };

      if (elementPatches.length > 0) {
        requestBody.patches = elementPatches;
      }

      const res = await fetch('/api/save-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to save");
      }

      if (mode === "auto") {
        setLastSavedAt(new Date());
        setAutoSaveStatus("saved");
      }

      if (mode === "manual") {
        setLastSavedAt(new Date());
        setAutoSaveStatus("saved");
      }

      return true;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to save customization data.";
      if (mode === "auto") {
        setAutoSaveStatus("error");
        setAutoSaveError(message);
      }
      if (mode === "manual") {
        alert(message);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    activeSite.path,
    collectAllEditablePatches,
    themeTokens,
    typographyPresetEnabled,
    typographyTokens,
  ]);

  useEffect(() => {
    if (!AUTO_SAVE_ENABLED) return;
    if (!activeSite.path) return;
    if (changeVersion === 0) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      void saveToDataStore("auto");
    }, 900);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [activeSite.path, changeVersion, saveToDataStore]);

  useEffect(() => {
    if (!activeSite.path || isCanonicalTemplatePath(activeSite.path)) {
      setPublishState(null);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/publish?sitePath=${encodeURIComponent(activeSite.path)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to load publish state");
        }
        if (controller.signal.aborted) return;
        setPublishState(payload?.published ? (payload.publish as PublishState) : null);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setPublishState(null);
        console.warn("Failed to load publish state:", error);
      });

    return () => {
      controller.abort();
    };
  }, [activeSite.path]);

  const handlePublish = async () => {
    if (!activeSite.path) {
      alert("Create or select a site before publishing.");
      return;
    }

    if (isCanonicalTemplatePath(activeSite.path)) {
      alert("Create a site from this template before publishing it.");
      return;
    }

    const saved = await saveToDataStore("manual");
    if (!saved) {
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitePath: activeSite.path }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.publish?.publicUrl) {
        throw new Error(payload?.error ?? "Failed to publish site");
      }

      setPublishState(payload.publish as PublishState);
      alert(`Site is live at ${payload.publish.publicUrl}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to publish site");
    } finally {
      setIsPublishing(false);
    }
  };

  const autoSaveTooltip = !AUTO_SAVE_ENABLED
    ? "Auto-save is off."
    : !activeSite.path
      ? "No site selected"
    : autoSaveStatus === "saving"
      ? "Saving changes..."
      : autoSaveStatus === "saved"
        ? `Saved${lastSavedAt ? ` at ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}`
        : autoSaveStatus === "error"
          ? autoSaveError ?? "Auto-save failed"
          : "Auto-save";
  const canvasHeaderMeta = viewport.id !== "responsive" ? CANVAS_HEADER_META[viewport.id] : null;
  const viewportHeightPx = viewport.id !== "responsive" ? Number.parseInt(viewport.height, 10) || 0 : 0;
  const canvasHeaderOffsetY = ((100 - zoom) / 100) * (viewportHeightPx / 2);
  const canvasFrameTransition = {
    width: { duration: 0 },
    height: { duration: 0 },
    scale: { duration: 0 },
  };
  const sidebarTransition = isPreviewSwitching
    ? { duration: 0 }
    : { duration: 0.16, ease: "easeOut" as const };

  type StructureSelectionTheme = "blue" | "purple";
  type StructureBranchContext = {
    inSelectedSubtree: boolean;
    selectionTheme: StructureSelectionTheme | null;
    hasFollowingInSelection: boolean;
    selectedRootDepth: number | null;
  };

  const selectedNodeTheme: StructureSelectionTheme | null = (() => {
    if (!selectedEditableNode) return null;
    const selectedTag = selectedElementRef.current?.tagName?.toLowerCase();
    if (selectedTag === "nav") return "purple";
    return "blue";
  })();

  const renderCanvasStructure = (
    nodes: CanvasStructureNode[],
    depth = 0,
    context: StructureBranchContext = {
      inSelectedSubtree: false,
      selectionTheme: null,
      hasFollowingInSelection: false,
      selectedRootDepth: null,
    }
  ): React.ReactNode =>
    nodes.map((node, index) => {
      const isSelected = selectedEditableNode?.editId === node.editId;
      const hasRenderedChildren = node.children.length > 0;
      const isLastSibling = index === nodes.length - 1;
      const hasFollowingSiblings = !isLastSibling;
      const isDescendantOfSelected = context.inSelectedSubtree && !isSelected;
      const showConnectorStub = depth > 0 && !context.inSelectedSubtree;
      const activeTheme = isSelected ? selectedNodeTheme : context.selectionTheme;
      const hasFollowingInSelectedFlow =
        context.inSelectedSubtree && (context.hasFollowingInSelection || hasFollowingSiblings);
      const basePaddingLeft = depth > 0 ? 14 : 8;
      const removedIndentLevels = context.inSelectedSubtree && context.selectedRootDepth !== null
        ? Math.max(0, depth - context.selectedRootDepth)
        : 0;
      const labelPaddingLeft = basePaddingLeft + removedIndentLevels * 20;

      const selectedRowShape = hasRenderedChildren ? "rounded-t-lg rounded-b-none" : "rounded-lg";
      const descendantRowShape = !hasRenderedChildren && !hasFollowingInSelectedFlow
        ? "rounded-t-none rounded-b-lg"
        : "rounded-t-none rounded-b-none";

      const toneClasses = isSelected
        ? activeTheme === "purple"
          ? "border-purple-500 bg-purple-500 text-white"
          : "border-blue-500 bg-blue-500 text-white"
        : isDescendantOfSelected
          ? activeTheme === "purple"
            ? "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800/50 dark:bg-purple-900/30 dark:text-purple-300"
            : "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/30 dark:text-blue-300"
          : "border-transparent hover:border-[#2a2d35] hover:bg-[#12151c] text-zinc-300";

      const rowShapeClasses = isSelected
        ? selectedRowShape
        : isDescendantOfSelected
          ? `${descendantRowShape} mt-0 mb-0`
          : "rounded-lg";

      const nextContext: StructureBranchContext = isSelected
        ? {
          inSelectedSubtree: true,
          selectionTheme: selectedNodeTheme,
          hasFollowingInSelection: false,
          selectedRootDepth: depth,
        }
        : context.inSelectedSubtree
          ? {
            inSelectedSubtree: true,
            selectionTheme: context.selectionTheme,
            hasFollowingInSelection: hasFollowingInSelectedFlow,
            selectedRootDepth: context.selectedRootDepth,
          }
          : {
            inSelectedSubtree: false,
            selectionTheme: null,
            hasFollowingInSelection: false,
            selectedRootDepth: null,
          };

      return (
        <div key={node.editId} className="relative">
          <div className="relative">
            {showConnectorStub && (
              <span
                className="pointer-events-none absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-[#2b313b]"
                aria-hidden="true"
              />
            )}
            <button
              onClick={() => focusEditableById(node.editId)}
              className={`mx-1 w-[calc(100%-0.5rem)] h-8 border text-left px-2 transition-colors ${toneClasses} ${rowShapeClasses}`}
              style={{ paddingLeft: `${labelPaddingLeft}px` }}
              title={node.editId}
            >
              <span className="block truncate text-[12px] font-medium">
                {node.label}
                <span className={`ml-2 text-[10px] uppercase tracking-[0.14em] ${isSelected
                  ? "text-white/75"
                  : isDescendantOfSelected
                    ? activeTheme === "purple"
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-blue-700 dark:text-blue-300"
                    : "text-zinc-500"
                  }`}
                >
                  {node.tagName}
                </span>
              </span>
            </button>
          </div>

          {hasRenderedChildren && (
            <div
              className={`${nextContext.inSelectedSubtree
                ? "ml-0 pl-0 border-l-0 space-y-0"
                : "ml-2.5 pl-2.5 border-l border-[#232934] space-y-1"
                }`}
            >
              {renderCanvasStructure(node.children, depth + 1, nextContext)}
            </div>
          )}
        </div>
      );
    });

  const selectedFields = selectedEditableNode?.fields ?? [];
  const supportsText = selectedFields.includes("text");
  const supportsImage = selectedFields.includes("image");
  const supportsButton = selectedFields.includes("button");
  const supportsColor = selectedFields.includes("color");
  const supportsFont = selectedFields.includes("font");
  const selectedElementTagName = selectedElementRef.current?.tagName.toLowerCase() ?? "";
  const isSelectedImageElement = selectedElementTagName === "img";
  const imageInitialVisibleCount = templateManifest?.presetUi.imageInitialVisible ?? 4;
  const sceneInitialVisibleCount = templateManifest?.presetUi.sceneInitialVisible ?? 4;
  const imagePresetsForTarget: TemplateImagePreset[] = selectedEditableNode
    ? (templateManifest?.imagePresets ?? []).filter(
      (preset) => preset.targetEditId === selectedEditableNode.editId
    )
    : [];
  const scenePresetsForTarget: TemplateScenePreset[] = selectedEditableNode
    ? (templateManifest?.scenePresets ?? []).filter(
      (preset) => preset.targetEditId === selectedEditableNode.editId
    )
    : [];
  const visibleImagePresets = showAllImagePresets
    ? imagePresetsForTarget
    : imagePresetsForTarget.slice(0, imageInitialVisibleCount);
  const visibleScenePresets = showAllScenePresets
    ? scenePresetsForTarget
    : scenePresetsForTarget.slice(0, sceneInitialVisibleCount);
  const hasMoreImagePresets = imagePresetsForTarget.length > visibleImagePresets.length;
  const hasMoreScenePresets = scenePresetsForTarget.length > visibleScenePresets.length;
  const normalizedSelectedBackground = normalizePresetPath(styles.backgroundImage);
  const supportsTypography = supportsColor || supportsFont;
  const currentPreset = typographyTokens[activeTypographyPreset];
  const normalizedFontQuery = fontQuery.trim().toLowerCase();
  const fontOptionsWithCustom = [
    ...EDITOR_FONT_OPTIONS,
    ...customFonts.map((font) => ({
      id: `custom-${font.family.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      label: `${font.family} (Uploaded)`,
      fontFamily: `"${font.family}", sans-serif`,
      category: "sans" as const,
    })),
  ];
  const selectedFontOption = fontOptionsWithCustom.find(
    (option) => normalizeFontToken(option.fontFamily) === normalizeFontToken(styles.fontFamily || "")
  ) ?? findEditorFontByFamily(styles.fontFamily);
  const selectedPresetFontOption = fontOptionsWithCustom.find(
    (option) => normalizeFontToken(option.fontFamily) === normalizeFontToken(currentPreset.fontFamily || "")
  ) ?? findEditorFontByFamily(currentPreset.fontFamily);
  const visibleFontOptions = fontOptionsWithCustom.filter((option) => {
    if (!normalizedFontQuery) return true;
    return (
      option.label.toLowerCase().includes(normalizedFontQuery) ||
      option.fontFamily.toLowerCase().includes(normalizedFontQuery) ||
      option.category.toLowerCase().includes(normalizedFontQuery)
    );
  });
  const fontSizeValue = clampNumber(
    Math.round(readNumericValue(styles.fontSize, 16)),
    FONT_SIZE_MIN,
    FONT_SIZE_MAX
  );
  const lineHeightValue = toRounded(
    clampNumber(readNumericValue(styles.lineHeight, 1.45), LINE_HEIGHT_MIN, LINE_HEIGHT_MAX),
    2
  );
  const letterSpacingValue = toRounded(
    clampNumber(readNumericValue(styles.letterSpacing, 0), LETTER_SPACING_MIN, LETTER_SPACING_MAX),
    1
  );
  const colorInputValue = toColorInputValue(styles.color, "#111111");
  const backgroundColorInputValue = toColorInputValue(styles.backgroundColor, "#0f172a");
  const contrast = contrastRatio(colorInputValue, backgroundColorInputValue);
  const minimumContrast = fontSizeValue >= 18 || Number(styles.fontWeight || "400") >= 700 ? 3 : 4.5;
  const accessibilityWarnings: string[] = [];
  if (contrast !== null && contrast < minimumContrast) {
    accessibilityWarnings.push(
      `Contrast ${contrast.toFixed(2)}:1 is below recommended ${minimumContrast}:1.`
    );
  }
  if (supportsTypography && fontSizeValue < 12) {
    accessibilityWarnings.push("Font size under 12px can reduce readability.");
  }
  if (supportsTypography && lineHeightValue < 1.2) {
    accessibilityWarnings.push("Line height under 1.2 can hurt text readability.");
  }

  useEffect(() => {
    for (const preset of visibleImagePresets) {
      prefetchImageAsset(preset.thumbnailUrl);
    }
    for (const preset of visibleImagePresets.slice(0, 2)) {
      prefetchImageAsset(preset.imageUrl);
    }

    for (const scene of visibleScenePresets) {
      prefetchImageAsset(scene.thumbnailUrl);
      for (const patch of scene.patches) {
        const backgroundImageValue = patch.styles?.backgroundImage;
        if (typeof backgroundImageValue !== "string") continue;
        const imageUrl = extractBackgroundImageUrl(backgroundImageValue);
        if (!imageUrl) continue;
        prefetchImageAsset(imageUrl);
      }
    }
  }, [prefetchImageAsset, visibleImagePresets, visibleScenePresets]);

  if (isMounting) return null;

  const dashboardHref = `/${i18n.defaultLocale}/dashboard`;
  const templatesHref = `/${i18n.defaultLocale}/templates`;

  return (
    <div className="flex h-screen w-full bg-[#090b0f] text-zinc-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Left Sidebar */}
      <AnimatePresence initial={false}>
        {!isPreviewMode && isSidebarOpen && (
          <motion.aside
            initial={{ x: -18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -18, opacity: 0 }}
            transition={sidebarTransition}
            className="h-full border-r border-white/10 bg-[#0b0d10]/95 backdrop-blur-xl flex flex-col overflow-hidden shrink-0 z-20 relative"
            style={{ width: leftPanelWidth }}
          >
            <div className="h-16 border-b border-gray-200 dark:border-[#242524] flex items-center px-4 shrink-0 bg-white dark:bg-[#111010]">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl leading-none text-gray-900 dark:text-gray-100">✦</span>
                <span className="font-montserrat text-sm font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  facadely
                </span>
              </Link>
            </div>

            <div className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
              <div className="text-[10px] flex items-center justify-between font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 mt-2 px-2">
                <span className="inline-flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5" />
                  Sites
                </span>
              </div>
              {websites.length === 0 ? (
                <div className="rounded-lg border border-[#222] bg-[#101217] px-3 py-3 text-[11px] leading-relaxed text-zinc-500">
                  No sites yet. Choose a template from your dashboard to start editing.
                </div>
              ) : websites.map((site) => {
                const isActive = activeSite.path === site.path;
                return (
                  <button
                    key={`${site.id}:${site.path}`}
                    onClick={() => {
                      clearSelection();
                      setActiveSite(site);
                    }}
                    className={`w-full flex flex-col items-start px-3 py-3 rounded-xl transition-all group ${isActive
                      ? "bg-indigo-500/10 border border-indigo-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "hover:bg-[#141414] border border-transparent"
                      }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1 rounded-md ${isActive ? "bg-indigo-500/20" : "bg-[#1a1a1a] group-hover:bg-[#222]"}`}>
                          <LayoutTemplate className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                        </div>
                        <span className={`text-[13px] font-semibold tracking-tight ${isActive ? "text-indigo-100" : "text-zinc-300"}`}>
                          {site.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 pl-[34px] font-medium">{site.desc}</span>
                  </button>
                );
              })}

              <div className="mt-6 pt-4 border-t border-[#1b1e26]">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-3 px-2">
                  Structure
                </div>
                {canvasStructure.length > 0 ? (
                  <div className="space-y-1">
                    {renderCanvasStructure(canvasStructure)}
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#222] bg-[#101217] px-3 py-2 text-[11px] text-zinc-500">
                    {hasActiveSite ? "No editable structure found." : "Select a site to inspect its editable structure."}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 shrink-0 bg-[#090b0f]">
              <button className="w-full h-10 rounded-lg bg-[#141414] border border-[#222] hover:bg-[#1a1a1a] hover:border-[#333] text-[13px] font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-all">
                <Settings className="w-4 h-4 text-zinc-400" />
                Editor Settings
              </button>
            </div>

            <div
              onMouseDown={handleResizeStart("left")}
              className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize transition-colors ${resizingSide === "left" ? "bg-indigo-500/40" : "bg-transparent hover:bg-indigo-500/20"}`}
              title="Resize sidebar"
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_30%_-10%,#151922_0%,#080a0f_45%,#040509_100%)] relative isolate">
        {/* Top Navbar */}
        {!isPreviewMode && (
          <header className="h-16 border-b border-gray-200 dark:border-[#242524] bg-white/95 dark:bg-[#111010]/95 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-20 relative">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-8 h-8 rounded-lg hover:bg-[#1a1a1a] border border-transparent hover:border-[#222] flex items-center justify-center text-zinc-400 transition-all"
              >
                {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <div className="h-4 w-px bg-gray-300 dark:bg-[#2a2a2a]" />
              <div className="flex items-center gap-1 bg-[#141414] border border-[#222] rounded-lg p-1 shadow-inner">
                {VIEWPORTS.map((vp) => (
                  <button
                    key={vp.id}
                    onClick={() => setViewport(vp)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${viewport.id === vp.id
                      ? "bg-[#2a2a2a] text-white shadow-sm ring-1 ring-white/5"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a1a]"
                      }`}
                    title={vp.name}
                  >
                    <vp.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <div className="text-[11px] font-mono font-medium text-zinc-500 ml-2 hidden lg:block tracking-widest bg-[#141414] px-2.5 py-1.5 rounded-md border border-[#222]">
                {viewport.width === "100%" ? "RESPONSIVE" : `${parseInt(viewport.width)}W \u00d7 ${parseInt(viewport.height)}H`}
              </div>

              <div className="flex items-center gap-1 bg-[#141414] border border-[#222] rounded-lg p-1 shadow-inner">
                <button
                  onClick={handleZoomOut}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:bg-[#1a1a1a] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomReset}
                  className="w-12 h-8 rounded-md flex items-center justify-center text-[11px] font-mono font-medium text-zinc-300 hover:bg-[#1a1a1a] transition-colors"
                  title="Reset Zoom"
                >
                  {zoom}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:bg-[#1a1a1a] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-gray-300 dark:border-[#4a4a4a] bg-gray-200 dark:bg-[#3a3a3a] px-1">
                <button
                  onClick={() => {
                    if (actionIndex >= 0) {
                      applyAction(actionStack[actionIndex], true);
                      setActionIndex(prev => prev - 1);
                    }
                  }}
                  disabled={actionIndex < 0}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-gray-700 dark:text-zinc-200 hover:bg-white/50 dark:hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  title="Undo (Cmd+Z)"
                >
                  <FaUndoAlt className="text-[12px]" />
                </button>
                <div className="h-4 w-px bg-gray-300 dark:bg-[#505050]" />
                <button
                  onClick={() => {
                    if (actionIndex < actionStack.length - 1) {
                      const nextAction = actionStack[actionIndex + 1];
                      applyAction(nextAction, false);
                      setActionIndex(prev => prev + 1);
                    }
                  }}
                  disabled={actionIndex >= actionStack.length - 1}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-gray-700 dark:text-zinc-200 hover:bg-white/50 dark:hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  title="Redo (Cmd+Shift+Z)"
                >
                  <FaRedoAlt className="text-[12px]" />
                </button>
              </div>

              <button
                className={`relative group w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${autoSaveStatus === "error"
                  ? "border-rose-300 dark:border-rose-700 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
                  : "border-gray-300 dark:border-[#4a4a4a] bg-gray-200 dark:bg-[#3a3a3a] text-gray-700 dark:text-zinc-200 hover:bg-gray-300 dark:hover:bg-[#474747]"
                  }`}
                title={autoSaveTooltip}
              >
                {!AUTO_SAVE_ENABLED && <ShieldCheck className="w-4 h-4 opacity-70" />}
                {AUTO_SAVE_ENABLED && autoSaveStatus === "saving" && <Save className="w-4 h-4 animate-spin" />}
                {AUTO_SAVE_ENABLED && autoSaveStatus === "saved" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {AUTO_SAVE_ENABLED && autoSaveStatus === "error" && <ShieldCheck className="w-4 h-4 text-rose-500" />}
                {AUTO_SAVE_ENABLED && autoSaveStatus === "idle" && (
                  <>
                    <ShieldCheck className="w-4 h-4 transition-opacity group-hover:opacity-0" />
                    <CheckCircle2 className="absolute w-4 h-4 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </>
                )}
                <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/85 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {autoSaveTooltip}
                </span>
              </button>

              <button
                onClick={handleTogglePreview}
                disabled={!hasActiveSite}
                className={`w-8 h-8 rounded-lg border border-gray-300 dark:border-[#4a4a4a] flex items-center justify-center transition-colors ${isPreviewMode
                  ? "bg-zinc-800 text-white"
                  : "bg-gray-200 dark:bg-[#3a3a3a] text-gray-700 dark:text-zinc-200 hover:bg-gray-300 dark:hover:bg-[#474747]"
                  }`}
                title="Preview (ESC to exit)"
              >
                <FaPlay className="text-[12px]" />
              </button>

              {publishState?.publicUrl && (
                <a
                  href={publishState.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden h-9 items-center gap-1 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15 xl:flex"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Live site
                </a>
              )}

              <button
                onClick={() => void handlePublish()}
                disabled={!hasActiveSite || isPublishing || isSaving}
                className="h-9 px-4 rounded-lg text-sm font-bold text-white bg-purple-700/90 hover:bg-purple-600 shadow-[0_8px_24px_rgba(126,34,206,0.45)] backdrop-blur-md border border-purple-400/40 transition-all flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                title={publishState ? "Update live site" : "Publish"}
              >
                <Rocket className="w-4 h-4" />
                {isPublishing ? "Publishing..." : publishState ? "Update Live" : "Publish"}
              </button>
            </div>
          </header>
        )}

        {/* Canvas Area */}
        <div className={`flex-1 relative custom-scrollbar ${isPreviewMode ? "overflow-hidden p-0" : "overflow-auto flex items-center justify-center p-4 md:p-12"}`}>
          {!isPreviewMode && (
            <>
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#94a3b810_1px,transparent_1px),linear-gradient(to_bottom,#94a3b810_1px,transparent_1px)] bg-[size:36px_36px]" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_24%,rgba(4,6,10,0.9)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
              <div className="absolute inset-x-[12%] top-[18%] h-[26%] pointer-events-none rounded-[999px] bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,rgba(99,102,241,0)_70%)] blur-3xl" />
            </>
          )}

          {isPreviewMode && isPreviewPostEffectsReady && (
            <button
              onClick={handleTogglePreview}
              className="absolute top-4 right-4 z-20 h-8 px-3 rounded-md bg-black/65 border border-white/20 text-xs font-semibold text-white backdrop-blur hover:bg-black/75 transition-colors"
            >
              Exit Preview (ESC)
            </button>
          )}

          <div className={isPreviewMode ? "relative h-full w-full" : "relative flex items-center justify-center"}>
            {!isPreviewMode && canvasHeaderMeta && (
              <div
                className="pointer-events-none absolute bottom-full z-30 mb-4 flex select-none items-center gap-3 rounded-lg border border-gray-200/50 bg-[#f8f9fa] px-3 py-2.5 dark:border-zinc-700/70 dark:bg-zinc-800/80"
                style={{
                  width: viewport.width,
                  left: "50%",
                  transform: `translate3d(-50%, ${canvasHeaderOffsetY}px, 0) scale(${zoom / 100})`,
                  transformOrigin: "bottom center",
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm dark:border-zinc-500/70 dark:bg-zinc-700 dark:text-zinc-100">
                  <canvasHeaderMeta.icon size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">{canvasHeaderMeta.title}</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-300 drop-shadow-[0_1px_0_rgba(0,0,0,0.3)]">{canvasHeaderMeta.sizeLabel}</p>
                </div>
              </div>
            )}

            {hasActiveSite ? (
              <motion.div
                layout={false}
                initial={false}
                animate={{
                  width: isPreviewMode ? "100%" : (viewport.id === "responsive" ? "100%" : viewport.width),
                  height: isPreviewMode ? "100%" : (viewport.id === "responsive" ? "100%" : viewport.height),
                  scale: isPreviewMode ? 1 : (zoom / 100),
                }}
                transition={canvasFrameTransition}
                className={`relative bg-transparent origin-center flex flex-col z-10 ${isPreviewMode || isPreviewSwitching ? "transition-none" : "transition-shadow duration-500"} ${isPreviewMode
                  ? "h-full w-full rounded-none shadow-none ring-0 overflow-hidden"
                  : viewport.id === "responsive"
                    ? "h-full w-full rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-black/40"
                    : "rounded-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-black/40"
                  }`}
                style={{
                  maxHeight: isPreviewMode || viewport.id === "responsive" ? "100%" : undefined,
                  maxWidth: isPreviewMode || viewport.id === "responsive" ? "100%" : undefined,
                }}
              >
                <div className="flex-1 w-full bg-transparent relative">
                  {!isPreviewMode && (
                    <div className="absolute inset-0 pointer-events-none z-10 ring-1 ring-black/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
                  )}
                  <iframe
                    ref={iframeRef}
                    key={activeSite.id}
                    src={activeSite.path}
                    onLoad={handleIframeLoad}
                    className="absolute inset-0 w-full h-full bg-transparent border-none"
                    title={`Preview of ${activeSite.name}`}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              </motion.div>
            ) : (
              <div className="relative z-10 mx-auto w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0f1218]/95 p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <LayoutTemplate className="h-6 w-6 text-zinc-200" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">No site selected</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                  Start from a template in your dashboard, then we&apos;ll open the site here with autosave and restore support.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={dashboardHref}
                    className="inline-flex h-11 items-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Go to dashboard
                  </Link>
                  <Link
                    href={templatesHref}
                    className="inline-flex h-11 items-center rounded-lg bg-purple-700/90 px-4 text-sm font-bold text-white shadow-[0_8px_24px_rgba(126,34,206,0.45)] ring-1 ring-purple-400/40 transition hover:bg-purple-600"
                  >
                    Explore templates
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Property Panel Sidebar */}
      <AnimatePresence initial={false}>
        {!isPreviewMode && isPropertyPanelOpen && (
          <motion.aside
            initial={{ x: 18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 18, opacity: 0 }}
            transition={sidebarTransition}
            className="h-full border-l border-white/10 bg-[#0b0d10]/95 backdrop-blur-xl flex flex-col overflow-hidden shrink-0 z-20 relative"
            style={{ width: rightPanelWidth }}
          >
            <div className="h-14 border-b border-white/10 px-2 flex items-center shrink-0 bg-[#090b0f]">
              <div className="flex w-full bg-[#141414] p-1 rounded-lg border border-[#222]">
                <button
                  onClick={() => setActivePanelTab('elements')}
                  className={`flex-1 h-8 rounded-md text-[12px] font-semibold transition-all flex items-center justify-center gap-2 ${activePanelTab === 'elements' ? 'bg-[#2a2a2a] text-white shadow-sm ring-1 ring-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Element
                </button>
                <button
                  onClick={() => setActivePanelTab('theme')}
                  className={`flex-1 h-8 rounded-md text-[12px] font-semibold transition-all flex items-center justify-center gap-2 ${activePanelTab === 'theme' ? 'bg-[#2a2a2a] text-white shadow-sm ring-1 ring-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Palette className="w-3.5 h-3.5" /> Tokens
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">

              {/* === THEME TOKENS TAB === */}
              {activePanelTab === "theme" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Global Design Tokens</div>
                    <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed">
                      Modify global CSS variables and typography presets. These act as the source of truth for all editable pages.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: themeTokens.primary }} /> Primary Color
                        </label>
                        <input
                          type="text"
                          value={themeTokens.primary}
                          onChange={(e) => updateThemeToken('primary', e.target.value)}
                          className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: themeTokens.secondary }} /> Secondary Color
                        </label>
                        <input
                          type="text"
                          value={themeTokens.secondary}
                          onChange={(e) => updateThemeToken('secondary', e.target.value)}
                          className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 border-t border-[#222] pt-4 mt-2">Global Border Radius</label>
                        <input
                          type="text"
                          value={themeTokens.radius}
                          onChange={(e) => updateThemeToken('radius', e.target.value)}
                          className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Base Spacing</label>
                        <input
                          type="text"
                          value={themeTokens.spacingBase}
                          onChange={(e) => updateThemeToken('spacingBase', e.target.value)}
                          className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#222] pt-5">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Global Typography Presets</div>
                    <label className="mb-4 flex items-center justify-between rounded-md border border-[#222] bg-[#101114] px-3 py-2">
                      <div>
                        <div className="text-[11px] font-semibold text-zinc-200">Apply Typography Preset</div>
                        <div className="text-[10px] text-zinc-500">Off keeps each template&apos;s original typography.</div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={typographyPresetEnabled}
                        onClick={() => updateTypographyPresetEnabled(!typographyPresetEnabled)}
                        className={`relative h-6 w-11 rounded-full border transition-colors ${typographyPresetEnabled
                          ? "border-indigo-400/60 bg-indigo-500/70"
                          : "border-[#2a2a2a] bg-[#151515]"
                          }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${typographyPresetEnabled ? "translate-x-5" : "translate-x-0.5"
                            }`}
                        />
                      </button>
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {(["heading", "body", "button"] as const).map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setActiveTypographyPreset(preset)}
                          className={`h-8 rounded-md text-[11px] font-semibold transition-colors ${activeTypographyPreset === preset
                            ? "bg-indigo-500 text-white"
                            : "bg-[#141414] border border-[#222] text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                          {preset.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-medium text-zinc-400">Preset Font Family</label>
                      <select
                        value={selectedPresetFontOption?.id ?? ""}
                        onChange={(e) => {
                          const option = fontOptionsWithCustom.find((item) => item.id === e.target.value);
                          if (!option) return;
                          updateTypographyPreset(activeTypographyPreset, "fontFamily", option.fontFamily);
                        }}
                        className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500"
                      >
                        <option value="" disabled>
                          {currentPreset.fontFamily ? "Custom font" : "Select font"}
                        </option>
                        {fontOptionsWithCustom.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label} · {option.category}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={currentPreset.fontFamily}
                        onChange={(e) => updateTypographyPreset(activeTypographyPreset, "fontFamily", e.target.value)}
                        className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                        placeholder='"Inter", sans-serif'
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-400">Weight</label>
                          <select
                            value={currentPreset.fontWeight}
                            onChange={(e) => updateTypographyPreset(activeTypographyPreset, "fontWeight", e.target.value)}
                            className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500"
                          >
                            {[300, 400, 500, 600, 700, 800, 900].map((weight) => (
                              <option key={weight} value={String(weight)}>
                                {weight}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-400">Font Size</label>
                          <input
                            type="text"
                            value={currentPreset.fontSize}
                            onChange={(e) => updateTypographyPreset(activeTypographyPreset, "fontSize", e.target.value)}
                            className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                            placeholder="16px"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-400">Line Height</label>
                          <input
                            type="text"
                            value={currentPreset.lineHeight}
                            onChange={(e) => updateTypographyPreset(activeTypographyPreset, "lineHeight", e.target.value)}
                            className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                            placeholder="1.4"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-400">Letter Spacing</label>
                          <input
                            type="text"
                            value={currentPreset.letterSpacing}
                            onChange={(e) => updateTypographyPreset(activeTypographyPreset, "letterSpacing", e.target.value)}
                            className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                            placeholder="0px"
                          />
                        </div>
                      </div>

                      <div
                        className="rounded-lg border border-[#23242a] bg-[#111217] px-3 py-2 text-[14px] text-zinc-100"
                        style={{ fontFamily: currentPreset.fontFamily }}
                      >
                        Typography preset preview: The quick brown fox jumps over the lazy dog.
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#222] pt-5 space-y-3">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Custom Font Upload (WOFF2)</div>
                    <input
                      type="text"
                      value={customFontFamilyInput}
                      onChange={(e) => setCustomFontFamilyInput(e.target.value)}
                      className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-3 font-mono outline-none focus:border-indigo-500"
                      placeholder="Font family name (e.g., Brand Sans)"
                    />
                    <input
                      ref={fontUploadInputRef}
                      type="file"
                      accept=".woff2,font/woff2"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        void handleUploadCustomFont(file);
                      }}
                    />
                    <button
                      onClick={() => fontUploadInputRef.current?.click()}
                      disabled={isUploadingFont}
                      className="w-full h-9 rounded-md bg-[#1d4ed8] hover:bg-[#2563eb] disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                    >
                      {isUploadingFont ? "Uploading..." : "Upload WOFF2 Font"}
                    </button>
                    {customFonts.length > 0 && (
                      <div className="rounded-lg border border-[#222] bg-[#111217] p-3 space-y-1">
                        {customFonts.map((font) => (
                          <div key={font.family} className="text-[11px] text-zinc-400 flex items-center justify-between gap-3">
                            <span className="text-zinc-200">{font.family}</span>
                            <span className="font-mono text-zinc-500 truncate">{font.url}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`rounded-md border px-3 py-2 text-[11px] ${
                    autoSaveStatus === "error"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  }`}>
                    {autoSaveStatus === "error"
                      ? autoSaveError ?? "Auto-save failed."
                      : isSaving || autoSaveStatus === "saving"
                        ? "Saving global token changes automatically..."
                        : "Global token changes save automatically."}
                  </div>
                </div>
              )}

              {/* === ELEMENTS TAB === */}
              {activePanelTab === "elements" && !hasSelection && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 animate-in fade-in">
                  <Box className="w-12 h-12 text-zinc-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-300">No element selected</p>
                    <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">Click any element in the canvas to edit its styles.</p>
                    {manifestError && (
                      <p className="text-[11px] text-rose-300 mt-2 max-w-[220px]">{manifestError}</p>
                    )}
                  </div>
                </div>
              )}

              {activePanelTab === "elements" && hasSelection && (
                <div className="space-y-8 animate-in fade-in duration-300">

                  <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg">
                    <div>
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Selected Mode</div>
                      <div className="text-[13px] text-indigo-100 font-medium mt-0.5">Editing {elementType}</div>
                      <div className="text-[10px] text-indigo-200/70 font-mono mt-1 truncate max-w-[180px]">
                        {selectedEditIdRef.current || "Edit ID unavailable"}
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-mono truncate max-w-[100px]">
                      {selectedElementRef.current?.tagName.toLowerCase()}
                    </span>
                  </div>

                  {/* DOM to Tailwind Write-back Action */}
                  {/* TEXT CONTENT EDITOR */}
                  {supportsText && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Type className="w-3 h-3" /> Content</span>
                      </div>
                      <textarea
                        value={styles.innerText}
                        onChange={(e) => updateStyle('innerText', e.target.value)}
                        className="w-full min-h-[80px] bg-[#141414] border border-[#222] rounded-lg text-[13px] text-zinc-200 p-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-y"
                        placeholder="Element text..."
                      />
                    </div>
                  )}

                  {supportsImage && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Image</div>
                      {isSelectedImageElement ? (
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-400">Image URL</label>
                          <input
                            type="text"
                            value={styles.src}
                            onChange={(e) => updateStyle("src", e.target.value)}
                            className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500 font-mono"
                            placeholder="https://..."
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400">Background Image URL</label>
                            <input
                              type="text"
                              value={styles.backgroundImage}
                              onChange={(e) => updateStyle("backgroundImage", e.target.value)}
                              className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500 font-mono"
                              placeholder="/webP/Cloud1.webp"
                            />
                          </div>

                          {imagePresetsForTarget.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400">Background Presets</label>
                                {hasMoreImagePresets && (
                                  <button
                                    type="button"
                                    onClick={() => setShowAllImagePresets(true)}
                                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300 hover:text-indigo-200 transition-colors"
                                  >
                                    Show More
                                  </button>
                                )}
                                {!hasMoreImagePresets && showAllImagePresets && imagePresetsForTarget.length > imageInitialVisibleCount && (
                                  <button
                                    type="button"
                                    onClick={() => setShowAllImagePresets(false)}
                                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 hover:text-zinc-200 transition-colors"
                                  >
                                    Collapse
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {visibleImagePresets.map((preset) => {
                                  const isActive = normalizePresetPath(preset.imageUrl) === normalizedSelectedBackground;
                                  return (
                                    <button
                                      key={preset.id}
                                      type="button"
                                      onMouseEnter={() => prefetchImageAsset(preset.imageUrl)}
                                      onFocus={() => prefetchImageAsset(preset.imageUrl)}
                                      onClick={() => updateStyle("backgroundImage", preset.imageUrl)}
                                      className={`group rounded-md border p-1 transition-all ${isActive
                                        ? "border-indigo-400/70 bg-indigo-500/15"
                                        : "border-[#2a2a2a] bg-[#141414] hover:border-indigo-400/40"
                                        }`}
                                      title={preset.label}
                                    >
                                      <span
                                        className="block h-11 w-full rounded-sm bg-cover bg-center"
                                        style={{ backgroundImage: `url("${preset.thumbnailUrl}")` }}
                                      />
                                      <span className="mt-1 block text-[10px] font-medium text-zinc-300">{preset.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {scenePresetsForTarget.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400">Style Packs</label>
                                {hasMoreScenePresets && (
                                  <button
                                    type="button"
                                    onClick={() => setShowAllScenePresets(true)}
                                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300 hover:text-indigo-200 transition-colors"
                                  >
                                    Show More
                                  </button>
                                )}
                                {!hasMoreScenePresets && showAllScenePresets && scenePresetsForTarget.length > sceneInitialVisibleCount && (
                                  <button
                                    type="button"
                                    onClick={() => setShowAllScenePresets(false)}
                                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 hover:text-zinc-200 transition-colors"
                                  >
                                    Collapse
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {visibleScenePresets.map((scene) => (
                                  <button
                                    key={scene.id}
                                    type="button"
                                    onMouseEnter={() => prefetchImageAsset(scene.thumbnailUrl)}
                                    onFocus={() => prefetchImageAsset(scene.thumbnailUrl)}
                                    onClick={() => void applyScenePreset(scene)}
                                    className="rounded-md border border-[#2a2a2a] bg-[#141414] p-1.5 text-left transition-all hover:border-indigo-400/40"
                                    title={scene.description ?? scene.label}
                                  >
                                    <span
                                      className="block h-12 w-full rounded-sm bg-cover bg-center"
                                      style={{ backgroundImage: `url("${scene.thumbnailUrl}")` }}
                                    />
                                    <span className="mt-1.5 block text-[10px] font-semibold text-zinc-200">{scene.label}</span>
                                    {scene.description && (
                                      <span className="mt-0.5 block text-[9px] leading-tight text-zinc-500">{scene.description}</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {supportsButton && selectedElementRef.current?.tagName.toLowerCase() === "a" && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Button</div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Link URL</label>
                        <input
                          type="text"
                          value={styles.href}
                          onChange={(e) => updateStyle("href", e.target.value)}
                          className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500 font-mono"
                          placeholder="https://... or /path"
                        />
                      </div>
                    </div>
                  )}

                  {supportsTypography && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Typography & Color</div>
                      <div className="space-y-4">
                        {supportsFont && (
                          <>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-zinc-400">Font Search</label>
                              <input
                                type="text"
                                value={fontQuery}
                                onChange={(e) => setFontQuery(e.target.value)}
                                className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500"
                                placeholder="Search sans / serif / name"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Font Family</label>
                                <select
                                  value={selectedFontOption?.id ?? ""}
                                  onChange={(e) => {
                                    const option = fontOptionsWithCustom.find((item) => item.id === e.target.value);
                                    if (!option) return;
                                    updateStyle("fontFamily", option.fontFamily);
                                  }}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-3 outline-none focus:border-indigo-500"
                                >
                                  <option value="" disabled>
                                    {styles.fontFamily ? "Custom font" : "Select font"}
                                  </option>
                                  {visibleFontOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.label} · {option.category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Current Font CSS</label>
                                <input
                                  type="text"
                                  value={styles.fontFamily}
                                  onChange={(e) => updateStyle("fontFamily", e.target.value)}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-3 outline-none font-mono focus:border-indigo-500"
                                  placeholder='"Inter", sans-serif'
                                />
                              </div>
                            </div>

                            <div
                              className="rounded-lg border border-[#23242a] bg-[#111217] px-3 py-2 text-[13px] text-zinc-100"
                              style={{ fontFamily: styles.fontFamily || undefined }}
                            >
                              The quick brown fox jumps over the lazy dog 1234567890
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400">Font Size</label>
                                <span className="text-[11px] text-zinc-500 font-mono">{fontSizeValue}px</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min={FONT_SIZE_MIN}
                                  max={FONT_SIZE_MAX}
                                  value={fontSizeValue}
                                  onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
                                  className="w-full accent-indigo-500"
                                />
                                <input
                                  type="number"
                                  min={FONT_SIZE_MIN}
                                  max={FONT_SIZE_MAX}
                                  value={fontSizeValue}
                                  onChange={(e) => {
                                    const next = clampNumber(
                                      Number(e.target.value || fontSizeValue),
                                      FONT_SIZE_MIN,
                                      FONT_SIZE_MAX
                                    );
                                    updateStyle("fontSize", `${Math.round(next)}px`);
                                  }}
                                  className="w-20 h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-2 outline-none font-mono focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {supportsColor && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-zinc-400">Text Color</label>
                              <div className="flex gap-2 items-center">
                                <div className="w-9 h-9 rounded-md border border-[#222] shrink-0" style={{ backgroundColor: styles.color || "transparent" }}>
                                  <input
                                    type="color"
                                    value={colorInputValue}
                                    onChange={(e) => updateStyle("color", e.target.value)}
                                    className="opacity-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={colorInputValue}
                                  onChange={(e) => updateStyle("color", e.target.value)}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-2 outline-none font-mono focus:border-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-zinc-400">Background Color</label>
                              <div className="flex gap-2 items-center">
                                <div className="w-9 h-9 rounded-md border border-[#222] shrink-0" style={{ backgroundColor: styles.backgroundColor || "transparent" }}>
                                  <input
                                    type="color"
                                    value={backgroundColorInputValue}
                                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                    className="opacity-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={backgroundColorInputValue}
                                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[12px] text-zinc-200 px-2 outline-none font-mono focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {supportsFont && (
                          <>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Weight</label>
                                <select
                                  value={styles.fontWeight || "400"}
                                  onChange={(e) => updateStyle("fontWeight", e.target.value)}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-2 outline-none focus:border-indigo-500"
                                >
                                  {[300, 400, 500, 600, 700, 800, 900].map((weight) => (
                                    <option key={weight} value={String(weight)}>
                                      {weight}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Line Height</label>
                                <input
                                  type="number"
                                  step="0.05"
                                  min={LINE_HEIGHT_MIN}
                                  max={LINE_HEIGHT_MAX}
                                  value={lineHeightValue}
                                  onChange={(e) => {
                                    const next = clampNumber(
                                      Number(e.target.value || lineHeightValue),
                                      LINE_HEIGHT_MIN,
                                      LINE_HEIGHT_MAX
                                    );
                                    updateStyle("lineHeight", String(toRounded(next, 2)));
                                  }}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-2 outline-none font-mono focus:border-indigo-500"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400">Letter Spacing</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min={LETTER_SPACING_MIN}
                                  max={LETTER_SPACING_MAX}
                                  value={letterSpacingValue}
                                  onChange={(e) => {
                                    const next = clampNumber(
                                      Number(e.target.value || letterSpacingValue),
                                      LETTER_SPACING_MIN,
                                      LETTER_SPACING_MAX
                                    );
                                    updateStyle("letterSpacing", `${toRounded(next, 1)}px`);
                                  }}
                                  className="w-full h-9 bg-[#141414] border border-[#222] rounded-md text-[13px] text-zinc-200 px-2 outline-none font-mono focus:border-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400">Line Height</label>
                                <span className="text-[11px] text-zinc-500 font-mono">{lineHeightValue}</span>
                              </div>
                              <input
                                type="range"
                                min={LINE_HEIGHT_MIN}
                                max={LINE_HEIGHT_MAX}
                                step="0.05"
                                value={lineHeightValue}
                                onChange={(e) => updateStyle("lineHeight", String(toRounded(Number(e.target.value), 2)))}
                                className="w-full accent-indigo-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400">Letter Spacing</label>
                                <span className="text-[11px] text-zinc-500 font-mono">{letterSpacingValue}px</span>
                              </div>
                              <input
                                type="range"
                                min={LETTER_SPACING_MIN}
                                max={LETTER_SPACING_MAX}
                                step="0.1"
                                value={letterSpacingValue}
                                onChange={(e) => updateStyle("letterSpacing", `${toRounded(Number(e.target.value), 1)}px`)}
                                className="w-full accent-indigo-500"
                              />
                            </div>
                          </>
                        )}

                        {accessibilityWarnings.length > 0 && (
                          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300 mb-1">
                              Accessibility
                            </div>
                            <div className="space-y-1">
                              {accessibilityWarnings.map((warning) => (
                                <p key={warning} className="text-[11px] text-amber-200/90 leading-relaxed">
                                  {warning}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!supportsText && !supportsImage && !supportsButton && !supportsTypography && (
                    <div className="rounded-lg border border-[#222] bg-[#121212] p-3 text-[11px] text-zinc-400">
                      This element has no editable fields in the template schema.
                    </div>
                  )}

                  {manifestError && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] text-rose-200">
                      {manifestError}
                    </div>
                  )}

                </div>
              )}
            </div>

            {hasSelection && activePanelTab === "elements" && (
              <div className="p-4 border-t border-[#1a1a1a] bg-[#0a0a0a]">
                <button
                  onClick={clearSelection}
                  className="w-full h-9 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
                >
                  Close & Deselect
                </button>
              </div>
            )}

            <div
              onMouseDown={handleResizeStart("right")}
              className={`absolute top-0 left-0 h-full w-1.5 cursor-col-resize transition-colors ${resizingSide === "right" ? "bg-indigo-500/40" : "bg-transparent hover:bg-indigo-500/20"}`}
              title="Resize panel"
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Editor() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <EditorContent />
    </Suspense>
  );
}
