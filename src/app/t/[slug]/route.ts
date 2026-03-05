import { NextResponse } from "next/server";
import { readStaticTemplateText, staticTemplateSitePath } from "@/lib/static-template-store";
import { readTemplateManifest } from "@/lib/template-manifest-store";
import { editorFontGoogleHrefMap } from "@/lib/font-catalog";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function injectBaseHref(html: string, baseHref: string): string {
  if (/<base\s/i.test(html)) return html;

  const baseTag = `<base href="${baseHref}/">`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
  }
  return `${baseTag}${html}`;
}

function buildCustomizationRuntimeScript(sitePath: string): string {
  const sitePathLiteral = JSON.stringify(sitePath);
  const fontHrefMap = JSON.stringify(editorFontGoogleHrefMap());
  return `<script>(function(){const sitePath=${sitePathLiteral};const tokenMap={primary:"--primary",secondary:"--secondary",radius:"--radius",spacingBase:"--spacing-base"};const fontHrefMap=${fontHrefMap};const toKebab=(v)=>v.replace(/[A-Z]/g,(m)=>"-"+m.toLowerCase());const normalizeFont=(v)=>String(v||"").split(",")[0].replace(/['"]/g,"").trim().toLowerCase();const escapeCss=(v)=>String(v||"").replace(/\\\\/g,"\\\\\\\\").replace(/"/g,'\\\\"');const ensureGoogleFont=(fontFamily)=>{const key=normalizeFont(fontFamily);if(!key)return;const href=fontHrefMap[key];if(!href)return;const id='facadely-runtime-font-'+key.replace(/[^a-z0-9_-]/g,'-');if(document.getElementById(id))return;const link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link);};const ensureCustomFonts=(customization)=>{const customFonts=Array.isArray(customization.customFonts)?customization.customFonts:[];if(!customFonts.length)return;let style=document.getElementById('facadely-custom-font-style');if(!style){style=document.createElement('style');style.id='facadely-custom-font-style';document.head.appendChild(style);}const css=customFonts.map((font)=>{if(!font||typeof font!=='object')return'';const family=escapeCss(font.family);const url=escapeCss(font.url);if(!family||!url)return'';return '@font-face{font-family:"'+family+'";src:url("'+url+'") format("woff2");font-display:swap;}';}).join('');if(style.textContent!==css){style.textContent=css;}};const applyTypography=(customization)=>{const typography=customization.typographyTokens&&typeof customization.typographyTokens==='object'?customization.typographyTokens:null;if(!typography)return;const root=document.documentElement;const heading=typography.heading&&typeof typography.heading==='object'?typography.heading:{};const body=typography.body&&typeof typography.body==='object'?typography.body:{};const button=typography.button&&typeof typography.button==='object'?typography.button:{};if(typeof heading.fontFamily==='string')root.style.setProperty('--type-heading-font',heading.fontFamily);if(typeof heading.fontWeight==='string')root.style.setProperty('--type-heading-weight',heading.fontWeight);if(typeof heading.fontSize==='string')root.style.setProperty('--type-heading-size',heading.fontSize);if(typeof heading.lineHeight==='string')root.style.setProperty('--type-heading-line-height',heading.lineHeight);if(typeof heading.letterSpacing==='string')root.style.setProperty('--type-heading-letter-spacing',heading.letterSpacing);if(typeof body.fontFamily==='string')root.style.setProperty('--type-body-font',body.fontFamily);if(typeof body.fontWeight==='string')root.style.setProperty('--type-body-weight',body.fontWeight);if(typeof body.fontSize==='string')root.style.setProperty('--type-body-size',body.fontSize);if(typeof body.lineHeight==='string')root.style.setProperty('--type-body-line-height',body.lineHeight);if(typeof body.letterSpacing==='string')root.style.setProperty('--type-body-letter-spacing',body.letterSpacing);if(typeof button.fontFamily==='string')root.style.setProperty('--type-button-font',button.fontFamily);if(typeof button.fontWeight==='string')root.style.setProperty('--type-button-weight',button.fontWeight);if(typeof button.fontSize==='string')root.style.setProperty('--type-button-size',button.fontSize);if(typeof button.lineHeight==='string')root.style.setProperty('--type-button-line-height',button.lineHeight);if(typeof button.letterSpacing==='string')root.style.setProperty('--type-button-letter-spacing',button.letterSpacing);[heading.fontFamily,body.fontFamily,button.fontFamily].forEach((fontFamily)=>{if(typeof fontFamily==='string')ensureGoogleFont(fontFamily);});let style=document.getElementById('facadely-typography-style');if(!style){style=document.createElement('style');style.id='facadely-typography-style';document.head.appendChild(style);}const css=':where(h1,h2,h3,h4,h5,h6){font-family:var(--type-heading-font)!important;font-weight:var(--type-heading-weight)!important;font-size:var(--type-heading-size)!important;line-height:var(--type-heading-line-height)!important;letter-spacing:var(--type-heading-letter-spacing)!important;}:where(p,li,span,small,label,blockquote,figcaption){font-family:var(--type-body-font)!important;font-weight:var(--type-body-weight)!important;font-size:var(--type-body-size)!important;line-height:var(--type-body-line-height)!important;letter-spacing:var(--type-body-letter-spacing)!important;}:where(button,a,[role=\"button\"],input[type=\"button\"],input[type=\"submit\"]){font-family:var(--type-button-font)!important;font-weight:var(--type-button-weight)!important;font-size:var(--type-button-size)!important;line-height:var(--type-button-line-height)!important;letter-spacing:var(--type-button-letter-spacing)!important;}';if(style.textContent!==css){style.textContent=css;}};const findTarget=(editId)=>{if(typeof editId!=="string"||!editId)return null;const escaped=(typeof CSS!=="undefined"&&CSS.escape)?CSS.escape(editId):editId;return document.querySelector('[data-edit-id="'+escaped+'"]');};const apply=(customization)=>{if(!customization||typeof customization!=="object")return;const themeTokens=customization.themeTokens&&typeof customization.themeTokens==="object"?customization.themeTokens:{};for(const [token,value]of Object.entries(themeTokens)){if(typeof value!=="string")continue;const cssVar=tokenMap[token];if(cssVar){document.documentElement.style.setProperty(cssVar,value);}}ensureCustomFonts(customization);if(customization.typographyPresetEnabled===true){applyTypography(customization);}const elements=Array.isArray(customization.elements)?customization.elements:[];for(const patch of elements){if(!patch||typeof patch!=="object")continue;const target=findTarget(patch.editId);if(!target)continue;const styles=patch.styles&&typeof patch.styles==="object"?patch.styles:{};const fontFamily=styles.fontFamily;if(typeof fontFamily==="string"){ensureGoogleFont(fontFamily);}for(const [property,value]of Object.entries(styles)){if(typeof property!=="string"||typeof value!=="string")continue;target.style.setProperty(toKebab(property),value);}if(typeof patch.innerText==="string"){target.innerText=patch.innerText;}if(typeof patch.src==="string"&&target.tagName==="IMG"){target.src=patch.src;}if(typeof patch.href==="string"&&target.tagName==="A"){target.setAttribute("href",patch.href);}}};fetch('/api/save-code?sitePath='+encodeURIComponent(sitePath)).then((res)=>res.ok?res.json():null).then((payload)=>{if(payload&&payload.customization){apply(payload.customization);}}).catch(()=>{});})();</script>`;
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const sitePath = staticTemplateSitePath(slug);
    const manifest = await readTemplateManifest(sitePath);
    if (!manifest || manifest.runtime.format !== "html") {
      return NextResponse.json({ error: "HTML template not found" }, { status: 404 });
    }

    const html = await readStaticTemplateText(slug, "index.html");
    const withBase = injectBaseHref(html, `/t/${slug}`);
    const withRuntime = withBase.includes("</body>")
      ? withBase.replace("</body>", `${buildCustomizationRuntimeScript(sitePath)}</body>`)
      : `${withBase}${buildCustomizationRuntimeScript(sitePath)}`;

    return new NextResponse(withRuntime, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("static template route error:", error);
    return NextResponse.json({ error: "Failed to render static template" }, { status: 500 });
  }
}
