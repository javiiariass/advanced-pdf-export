import {
  App, Component, MarkdownRenderer, MarkdownView, Menu, Modal, Notice,
  Plugin, PluginSettingTab, Setting, TFile, setIcon,
} from "obsidian";
import hljs from "highlight.js/lib/core";
import { HLJS_THEMES } from "./hljs-themes";

// Register only a curated set of languages — the full hljs bundle ships ~190.
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("python", python);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZES: Record<string, { w: number; h: number }> = {
  A4:     { w: 794,  h: 1123 },
  A3:     { w: 1123, h: 1587 },
  Letter: { w: 816,  h: 1056 },
  Legal:  { w: 816,  h: 1344 },
  A5:     { w: 559,  h: 794  },
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface DocStyle {
  name: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  headingScale: number;
  accentColor: string;
  bodyColor: string;
  headingColor: string;
  h1BorderBottom: boolean;
  h2BorderBottom: boolean;
  centerH1: boolean;
  blockquoteBg: string;
  blockquoteBorderColor: string;
  codeBackground: string;
  codeFontSize: number;
  codeTheme: string;
  tableHeaderBg: string;
  tableStriped: boolean;
  pageBackground: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

// Minimal Electron type shims — just enough for the PDF export path.

interface ElectronBrowserWindow {
  loadURL(url: string): void;
  close(): void;
  webContents: {
    once(event: "did-fail-load", listener: (event: unknown, code: number, desc: string) => void): void;
    once(event: "did-finish-load", listener: () => void): void;
    printToPDF(options: {
      pageSize: string;
      landscape: boolean;
      printBackground: boolean;
      margins: { marginType: string };
    }): Promise<Buffer>;
  };
}

interface ElectronRemote {
  dialog: {
    showSaveDialog(options: {
      title: string;
      defaultPath: string;
      filters: { name: string; extensions: string[] }[];
    }): Promise<{ canceled: boolean; filePath?: string }>;
  };
  BrowserWindow: new (options: {
    show: boolean;
    webPreferences: { nodeIntegration: boolean };
  }) => ElectronBrowserWindow;
}

interface ElectronFs {
  writeFile(path: string, data: Buffer, cb: (err: Error | null) => void): void;
}

interface ElectronBridge {
  require(module: "@electron/remote"): ElectronRemote;
  require(module: "fs"): ElectronFs;
  require(module: string): unknown;
}

interface AppWithSettings {
  setting?: {
    open?: () => void;
    openTabById?: (id: string) => void;
  };
}

interface PDFExportSettings extends DocStyle {
  pageSize: string;
  orientation: "portrait" | "landscape";
  preset: string;
  headerText: string;
  footerText: string;
  showHeader: boolean;
  showFooter: boolean;
  showFooterBorder: boolean;
  showPageNumbers: boolean;
  pageNumberPosition: "center" | "left" | "right";
  pageNumberStart: number;
  showHeaderFooterOnFirstPage: boolean;
  headerAlignment: "left" | "center" | "right";
  hideFrontmatter: boolean;
  customFontName: string;
  autoBreakH1: boolean;
  autoBreakH2: boolean;
  includeFilenameAsTitle: boolean;
  previewScale: number;
}

// Cached layout — holds everything drawPreview and exportPDF need so that
// zoom changes can redraw without re-paginating.
interface LayoutCache {
  layouts: PageLayout[];
  pw: number;
  ph: number;
  mTop: number;
  mLeft: number;
  mRight: number;
  footerH: number;
  headerH: number;
  contentW: number;
  contentH: number;
  docCSS: string;
  fontFamily: string;
  accentColor: string;
  pageBackground: string;
  isRTL: boolean;
}

interface PageLayout {
  pageNodes: HTMLElement[];
  pageNum: number;
  totalPages: number;
  headerLeft: string;
  headerCenter: string;
  headerRight: string;
  footerLeft: string;
  footerRight: string;
  footerCenter: string;
}

// ─── Style Presets ────────────────────────────────────────────────────────────

const PRESETS: Record<string, DocStyle> = {
  default: {
    name: "Default",
    fontFamily: "Georgia, serif",
    fontSize: 13,
    lineHeight: 1.85,
    paragraphSpacing: 0.65,
    headingScale: 1.0,
    accentColor: "#7c6af7",
    bodyColor: "#1a1a2e",
    headingColor: "#0d0d1a",
    h1BorderBottom: false,
    h2BorderBottom: true,
    centerH1: false,
    blockquoteBg: "transparent",
    blockquoteBorderColor: "#7c6af7",
    codeBackground: "#f0f0f8",
    codeFontSize: 0.85,
    codeTheme: "github",
    tableHeaderBg: "#f0f0f8",
    tableStriped: true,
    pageBackground: "#ffffff",
    marginTop: 20, marginBottom: 20, marginLeft: 25, marginRight: 25,
  },
  minimal: {
    name: "Minimal",
    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
    fontSize: 12,
    lineHeight: 1.6,
    paragraphSpacing: 0.45,
    headingScale: 0.88,
    accentColor: "#333",
    bodyColor: "#222",
    headingColor: "#111",
    h1BorderBottom: false,
    h2BorderBottom: false,
    centerH1: false,
    blockquoteBg: "#f8f8f8",
    blockquoteBorderColor: "#ccc",
    codeBackground: "#f4f4f4",
    codeFontSize: 0.82,
    codeTheme: "github",
    tableHeaderBg: "#efefef",
    tableStriped: false,
    pageBackground: "#ffffff",
    marginTop: 16, marginBottom: 16, marginLeft: 20, marginRight: 20,
  },
  academic: {
    name: "Academic",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 12,
    lineHeight: 2.0,
    paragraphSpacing: 0.0,
    headingScale: 0.95,
    accentColor: "#1a3a6b",
    bodyColor: "#000",
    headingColor: "#000",
    h1BorderBottom: true,
    h2BorderBottom: true,
    centerH1: true,
    blockquoteBg: "transparent",
    blockquoteBorderColor: "#999",
    codeBackground: "#f9f9f9",
    codeFontSize: 0.88,
    codeTheme: "github",
    tableHeaderBg: "#e8e8e8",
    tableStriped: false,
    pageBackground: "#ffffff",
    marginTop: 25, marginBottom: 25, marginLeft: 30, marginRight: 30,
  },
  colorful: {
    name: "Colorful",
    fontFamily: "Georgia, serif",
    fontSize: 13,
    lineHeight: 1.85,
    paragraphSpacing: 0.65,
    headingScale: 1.05,
    accentColor: "#e84393",
    bodyColor: "#1a1a2e",
    headingColor: "#2d0a4e",
    h1BorderBottom: false,
    h2BorderBottom: false,
    centerH1: false,
    blockquoteBg: "#fdf0f8",
    blockquoteBorderColor: "#e84393",
    codeBackground: "#f0eaff",
    codeFontSize: 0.85,
    codeTheme: "tokyo-night-light",
    tableHeaderBg: "#2d0a4e",
    tableStriped: true,
    pageBackground: "#ffffff",
    marginTop: 20, marginBottom: 20, marginLeft: 25, marginRight: 25,
  },
  modern: {
    name: "Modern",
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    lineHeight: 1.75,
    paragraphSpacing: 0.6,
    headingScale: 1.0,
    accentColor: "#0070f3",
    bodyColor: "#111",
    headingColor: "#000",
    h1BorderBottom: false,
    h2BorderBottom: false,
    centerH1: false,
    blockquoteBg: "#f0f7ff",
    blockquoteBorderColor: "#0070f3",
    codeBackground: "#f1f5f9",
    codeFontSize: 0.85,
    codeTheme: "atom-one-light",
    tableHeaderBg: "#0070f3",
    tableStriped: true,
    pageBackground: "#ffffff",
    marginTop: 20, marginBottom: 20, marginLeft: 25, marginRight: 25,
  },
  newspaper: {
    name: "Newspaper",
    fontFamily: "Georgia, serif",
    fontSize: 12,
    lineHeight: 1.7,
    paragraphSpacing: 0.4,
    headingScale: 1.1,
    accentColor: "#111",
    bodyColor: "#111",
    headingColor: "#000",
    h1BorderBottom: true,
    h2BorderBottom: true,
    centerH1: true,
    blockquoteBg: "transparent",
    blockquoteBorderColor: "#111",
    codeBackground: "#f4f4f4",
    codeFontSize: 0.82,
    codeTheme: "github",
    tableHeaderBg: "#111",
    tableStriped: false,
    pageBackground: "#ffffff",
    marginTop: 18, marginBottom: 18, marginLeft: 20, marginRight: 20,
  },
  dark: {
    name: "Dark",
    fontFamily: "Georgia, serif",
    fontSize: 13,
    lineHeight: 1.85,
    paragraphSpacing: 0.65,
    headingScale: 1.0,
    accentColor: "#818cf8",
    bodyColor: "#d1d5db",
    headingColor: "#f1f5f9",
    h1BorderBottom: false,
    h2BorderBottom: true,
    centerH1: false,
    blockquoteBg: "#1e293b",
    blockquoteBorderColor: "#818cf8",
    codeBackground: "#0f172a",
    codeFontSize: 0.85,
    codeTheme: "atom-one-dark",
    tableHeaderBg: "#1e293b",
    tableStriped: true,
    pageBackground: "#111827",
    marginTop: 20, marginBottom: 20, marginLeft: 25, marginRight: 25,
  },
};

const DEFAULT_SETTINGS: PDFExportSettings = {
  pageSize: "A4",
  orientation: "portrait",
  preset: "default",
  ...PRESETS["default"],
  headerText: "",
  footerText: "",
  showHeader: true,
  showFooter: true,
  showFooterBorder: false,
  showPageNumbers: true,
  pageNumberPosition: "right",
  pageNumberStart: 1,
  showHeaderFooterOnFirstPage: true,
  headerAlignment: "right",
  hideFrontmatter: false,
  customFontName: "",
  autoBreakH1: false,
  autoBreakH2: false,
  includeFilenameAsTitle: false,
  previewScale: 0.90,
};

// ─── Utilities ────────────────────────────────────────────────────────────────

/** mm → px at 96 dpi, matching Electron's print pipeline. */
const mmToPx = (mm: number) => (mm / 25.4) * 96;

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Escapes `</style` in CSS text to prevent the HTML parser from ending the
// <style> block early, regardless of where the sequence appears.
function escapeCSSForStyle(css: string): string {
  return css.replace(/<\/style/gi, "<\\/style");
}

/** True when RTL script chars (Arabic, Hebrew, etc.) exceed 10 % of all
 *  alpha chars — ratio-based so mixed-script notes lean toward the majority. */
const RTL_CHARS   = /[\u0590-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/g;
const TOTAL_ALPHA = /[A-Za-z\u0590-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/g;
function isRTLContent(text: string): boolean {
  const rtl   = (text.match(RTL_CHARS)   ?? []).length;
  const total = (text.match(TOTAL_ALPHA) ?? []).length;
  return total > 0 && rtl / total > 0.1;
}

// ─── Markdown helpers ─────────────────────────────────────────────────────────

/** Normalises line endings to LF so the rest of the pipeline never sees CRLF. */
function normalizeMarkdown(raw: string): string {
  return raw.replace(/\r\n/g, "\n");
}

/** Strips an opening YAML frontmatter block (--- … ---); returns the string unchanged if none is found. */
function stripFrontmatter(md: string): string {
  return md.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/, "");
}

/** Splits on `///` manual page-break markers, trimming and dropping empty sections. */
function splitMarkdownSections(md: string): string[] {
  return md
    .split(/^\/\/\/\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function renderMarkdownToEl(
  app: App,
  markdown: string,
  sourcePath: string,
  component: Component,
): Promise<HTMLElement> {
  const temp = activeDocument.createElement("div");
  // Attach offscreen to the live document so Obsidian's async code-block
  // post-processors (including mermaid) can render into a real DOM context.
  // The element is detached again before being returned.
  temp.setCssStyles({ position: "fixed", top: "0", left: "-99999px", visibility: "hidden", pointerEvents: "none" });
  activeDocument.body.appendChild(temp);
  try {
    await MarkdownRenderer.render(app, markdown, temp, sourcePath, component);
    await waitForMermaidDiagrams(temp);
  } finally {
    activeDocument.body.removeChild(temp);
  }
  postProcessRenderedHTML(temp);
  return temp;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Strips Obsidian-specific artefacts from rendered HTML so the output is
// clean for pagination and export: assigns stable heading IDs for anchor
// links, removes external-link decorators and copy-code buttons, force-expands
// callouts, and strips top-level theme <style>/<script> injections while
// preserving styles embedded inside SVGs (mermaid stores its theme CSS there).
function postProcessRenderedHTML(root: HTMLElement): void {
  // Stable, deduplicated IDs so in-page anchor links work across shadow DOMs.
  const seen = new Map<string, number>();
  root.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el) => {
    const text = el.textContent || "";
    const base = slugifyHeading(text);
    if (!base) return;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    el.id = count === 0 ? base : `${base}-${count}`;
  });

  // The external-link class triggers a ↗ icon via theme CSS — meaningless in print.
  root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
    a.classList.remove("external-link");
  });

  root.querySelectorAll(".copy-code-button").forEach((el) => el.remove());

  // Force-expand callouts: remove fold controls and collapsed state.
  root.querySelectorAll<HTMLElement>(".callout").forEach((callout) => {
    callout.removeAttribute("data-callout-fold");
    callout.classList.remove("is-collapsed");
    callout.querySelectorAll(".callout-fold").forEach((el) => el.remove());
  });

  // Drop theme-injected top-level <style>/<script> nodes — they can break the
  // export <head> if they contain `</style>`, and are not needed in the PDF.
  // Styles inside <svg> are kept: mermaid embeds its theme CSS directly there.
  root.querySelectorAll("style, script").forEach((el) => {
    if (!el.closest("svg")) el.remove();
  });

  // Re-tokenize code blocks with highlight.js so the PDF gets deterministic
  // syntax highlighting independent of Obsidian's theme/Prism state.
  root.querySelectorAll<HTMLElement>("pre code").forEach(highlightCodeBlock);
}

// Applies highlight.js to a single <code> block in place: reads its language
// class (falling back to auto-detect), replaces the content with hljs token
// spans, and tags it `.hljs`. We read textContent first, discarding Obsidian's
// Prism spans. Shared by the post-processor and the paginator's PRE splitter so
// code blocks that get split across pages keep their highlighting.
function highlightCodeBlock(block: HTMLElement): void {
  const lang = Array.from(block.classList)
    .find((c) => c.startsWith("language-"))?.replace("language-", "");
  const code = block.textContent ?? "";
  const result = lang && hljs.getLanguage(lang)
    ? hljs.highlight(code, { language: lang })
    : hljs.highlightAuto(code);
  block.innerHTML = result.value;
  block.classList.add("hljs");
}

// Prefixes every selector in a highlight.js theme stylesheet with `scope`, e.g.
// `.hljs-keyword` -> `.mpdf-doc .hljs-keyword`. Prefixing at the start of each
// selector (rather than rewriting `.hljs` inline) keeps compound selectors like
// `pre code.hljs` valid and lifts specificity above our own `.mpdf-doc` code
// rules. hljs theme files are flat (no @media / nesting) once comments — the
// only place `@` appears — are stripped, so a selector-list pass is sufficient.
function scopeThemeCSS(css: string, scope: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/([^{}]+)\{/g, (_m, selectors: string) =>
      selectors
        .split(",")
        .map((sel) => (sel.trim() ? `${scope} ${sel.trim()}` : sel))
        .join(", ") + " {",
    );
}

/** Waits for Obsidian's mermaid post-processor to finish converting all mermaid
 *  code blocks into rendered SVGs.  Each `.mermaid` container is watched via a
 *  MutationObserver; resolves immediately if already rendered, otherwise waits
 *  up to 5 s per diagram before timing out. */
async function waitForMermaidDiagrams(el: HTMLElement): Promise<void> {
  const containers = Array.from(el.querySelectorAll<HTMLElement>(".mermaid"));
  if (containers.length === 0) return;
  const TIMEOUT_MS = 5000;
  await Promise.all(
    containers.map(
      (m) =>
        new Promise<void>((resolve) => {
          if (m.querySelector("svg")) { resolve(); return; }
          const timer = window.setTimeout(() => { obs.disconnect(); resolve(); }, TIMEOUT_MS);
          const obs = new MutationObserver(() => {
            if (m.querySelector("svg")) {
              window.clearTimeout(timer);
              obs.disconnect();
              resolve();
            }
          });
          obs.observe(m, { childList: true, subtree: true });
        }),
    ),
  );
}

// ─── CSS generator ────────────────────────────────────────────────────────────

/** Returns relative luminance (0–1) of a CSS hex color; non-hex values return 1 (treat as light). */
function hexLuminance(hex: string): number {
  const full = hex.replace(
    /^#([\da-f])([\da-f])([\da-f])$/i,
    (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`,
  );
  if (!/^#[\da-f]{6}$/i.test(full)) return 1;
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const r = linearize(parseInt(full.slice(1, 3), 16) / 255);
  const g = linearize(parseInt(full.slice(3, 5), 16) / 255);
  const b = linearize(parseInt(full.slice(5, 7), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function buildDocCSS(s: PDFExportSettings, isRTL = false): string {
  const hs = s.headingScale;
  const fontFamily = s.fontFamily === "__custom__"
    ? (s.customFontName.trim() || "inherit")
    : s.fontFamily;
  const tableHeaderTextColor =
    hexLuminance(s.tableHeaderBg) < 0.35 ? "#fff" : s.headingColor;
  // Scope the chosen highlight.js theme to `.mpdf-doc`. Beyond isolation, the
  // added class raises every theme rule to specificity (0,2,x) so the theme's
  // base + token colours outrank our own `.mpdf-doc code` (0,1,1) and
  // `.mpdf-doc pre code` (0,1,2) rules — otherwise dark-theme base text would
  // fall back to bodyColor and disappear on a dark background.
  const hljsCSS = scopeThemeCSS(HLJS_THEMES[s.codeTheme]?.css ?? "", ".mpdf-doc");

  return `
  .mpdf-doc {
    font-family: ${fontFamily};
    font-size: ${s.fontSize}px;
    line-height: ${s.lineHeight};
    color: ${s.bodyColor};
    box-sizing: border-box;
    ${isRTL ? "direction: rtl;" : ""}
  }
  .mpdf-doc *, .mpdf-doc *::before, .mpdf-doc *::after { box-sizing: border-box; }
  .mpdf-doc strong, .mpdf-doc b { font-weight: 700; font-style: normal; }
  .mpdf-doc em, .mpdf-doc i { font-style: italic; font-weight: inherit; }
  .mpdf-doc mark { background: #ffe066; color: inherit; padding: 0 2px; border-radius: 2px; }
  .mpdf-doc del, .mpdf-doc s { text-decoration: line-through; }
  .mpdf-doc h1 {
    font-size: ${Math.round(22 * hs)}px;
    font-weight: 700;
    color: ${s.headingColor};
    margin: 0 0 ${Math.round(12 * hs)}px;
    line-height: 1.2;
    ${s.h1BorderBottom ? `border-bottom: 2px solid ${s.accentColor}; padding-bottom: 6px;` : ""}
    ${s.centerH1 ? "text-align: center;" : ""}
  }
  .mpdf-doc h2 {
    font-size: ${Math.round(17 * hs)}px;
    font-weight: 600;
    color: ${s.headingColor};
    margin: ${Math.round(20 * hs)}px 0 ${Math.round(10 * hs)}px;
    ${s.h2BorderBottom ? `border-bottom: 0.5px solid ${s.accentColor}55; padding-bottom: 5px;` : ""}
  }
  .mpdf-doc h3 {
    font-size: ${Math.round(15 * hs)}px;
    font-weight: 700;
    color: ${s.headingColor};
    margin: ${Math.round(16 * hs)}px 0 ${Math.round(8 * hs)}px;
    letter-spacing: 0.01em;
  }
  .mpdf-doc h4 { font-size: ${Math.round(13 * hs)}px; font-weight: 700; color: ${s.headingColor}; margin: 12px 0 6px; text-transform: uppercase; letter-spacing: 0.04em; }
  .mpdf-doc h5 { font-size: ${Math.round(12 * hs)}px; font-weight: 600; color: ${s.headingColor}; margin: 10px 0 4px; font-style: italic; }
  .mpdf-doc h6 { font-size: ${Math.round(11 * hs)}px; font-weight: 600; color: ${s.bodyColor}; margin: 8px 0 4px; font-style: italic; opacity: 0.75; }
  .mpdf-doc p { margin: 0 0 ${s.paragraphSpacing}em; }
  .mpdf-doc ul, .mpdf-doc ol { padding-inline-start: 1.4em; margin: 0 0 ${s.paragraphSpacing}em; }
  .mpdf-doc li { margin-bottom: 0.2em; line-height: ${s.lineHeight}; }
  .mpdf-doc blockquote {
    border-inline-start: 3px solid ${s.blockquoteBorderColor};
    background: ${s.blockquoteBg};
    padding-block: 4px;
    padding-inline: 1em 0;
    margin: ${s.paragraphSpacing}em 0;
    font-style: italic;
    color: ${s.bodyColor}cc;
  }
  .mpdf-doc code {
    font-family: 'Courier New', monospace;
    font-size: ${s.codeFontSize}em;
    background: ${s.codeBackground};
    padding: 1px 4px;
    border-radius: 3px;
    color: ${s.accentColor};
  }
  .mpdf-doc pre {
    background: ${s.codeBackground};
    border-radius: 4px;
    padding: 10px 12px;
    margin: 0 0 ${s.paragraphSpacing}em;
    overflow: hidden;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .mpdf-doc pre code {
    font-family: 'Courier New', monospace;
    font-size: ${s.codeFontSize}em;
    color: inherit;
    white-space: pre-wrap;
    word-break: break-all;
    background: none;
    padding: 0;
  }
  ${hljsCSS}
  /* Neutralize the theme's own .hljs background/padding (specificity 0,2,0)
     so the block background stays under codeBackground (on the <pre>). The
     theme still governs token + default text colours. */
  .mpdf-doc pre code.hljs {
    background: none;
    padding: 0;
  }
  .mpdf-doc hr {
    border: none;
    border-top: 0.5px solid ${s.accentColor}44;
    margin: ${s.paragraphSpacing * 1.5}em 0;
  }
  .mpdf-doc img { max-width: 100%; height: auto; display: block; margin: ${s.paragraphSpacing}em auto; }
  .mpdf-doc a { color: ${s.accentColor}; }
  .mpdf-doc a.external-link::after { display: none !important; content: none !important; }
  /* Hide copy-code buttons that survive postProcessRenderedHTML (e.g. re-injected by themes). */
  .mpdf-doc .copy-code-button { display: none !important; }
  .mpdf-doc table { width: 100%; border-collapse: collapse; margin: 0 0 ${s.paragraphSpacing}em; font-size: 0.92em; }
  .mpdf-doc th {
    background: ${s.tableHeaderBg};
    color: ${tableHeaderTextColor};
    padding: 6px 10px;
    text-align: start;
    font-weight: 600;
    border: 0.5px solid ${s.accentColor}33;
    font-size: 0.9em;
  }
  .mpdf-doc td { padding: 5px 10px; border: 0.5px solid ${s.bodyColor}22; vertical-align: top; }
  ${s.tableStriped ? `.mpdf-doc tbody tr:nth-child(even) { background: ${s.tableHeaderBg}55; }` : ""}

  /* Callouts — override theme styles with !important so preview and export are
   * identical regardless of the active Obsidian theme. */
  .mpdf-doc .callout {
    border-inline-start: 4px solid ${s.accentColor} !important;
    border-start-start-radius: 0 !important;
    border-start-end-radius: 5px !important;
    border-end-end-radius: 5px !important;
    border-end-start-radius: 0 !important;
    background: ${s.accentColor}12 !important;
    margin: ${s.paragraphSpacing * 1.2}em 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    box-shadow: inset 0 0 0 1px ${s.accentColor}22 !important;
    font-style: normal !important;
  }
  .mpdf-doc .callout-title {
    display: flex !important;
    align-items: center !important;
    gap: 7px !important;
    padding: 7px 12px !important;
    background: ${s.accentColor}28 !important;
    border-bottom: 1px solid ${s.accentColor}33 !important;
    font-family: ${fontFamily} !important;
    font-size: 0.8em !important;
    font-weight: 800 !important;
    font-style: normal !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: ${s.accentColor} !important;
    line-height: 1.3 !important;
  }
  .mpdf-doc .callout-icon {
    display: inline-flex !important;
    align-items: center !important;
    flex-shrink: 0 !important;
    width: 15px !important;
    height: 15px !important;
    color: ${s.accentColor} !important;
  }
  .mpdf-doc .callout-icon svg {
    width: 15px !important;
    height: 15px !important;
    stroke: ${s.accentColor} !important;
    fill: none !important;
    stroke-width: 2 !important;
  }
  .mpdf-doc .callout-title-inner {
    flex: 1 !important;
    min-width: 0 !important;
  }
  .mpdf-doc .callout-fold { display: none !important; }
  .mpdf-doc .callout-content {
    padding: 9px 14px !important;
    color: ${s.bodyColor} !important;
    font-style: normal !important;
    background: transparent !important;
  }
  .mpdf-doc .callout-content > p:first-child { margin-top: 0 !important; }
  .mpdf-doc .callout-content > p:last-child  { margin-bottom: 0 !important; }
  /* Nested blockquotes inside callout content keep a subtler indent */
  .mpdf-doc .callout-content blockquote {
    border-inline-start-color: ${s.accentColor}66 !important;
    background: transparent !important;
  }

  /* Mermaid diagrams — centre the SVG and prevent it overflowing the content
   * column.  The <style> block inside the SVG is intentionally left untouched;
   * mermaid embeds its own theme CSS there. */
  .mpdf-doc .mermaid {
    display: flex;
    justify-content: center;
    margin: ${s.paragraphSpacing}em 0;
    overflow: hidden;
  }
  .mpdf-doc .mermaid svg {
    max-width: 100%;
    height: auto;
    display: block;
  }
  `.trim();
}

/** Extracts only the DocStyle fields from the broader settings object. */
function extractDocStyle(s: PDFExportSettings): DocStyle {
  return {
    name: s.name, fontFamily: s.fontFamily, fontSize: s.fontSize,
    lineHeight: s.lineHeight, paragraphSpacing: s.paragraphSpacing,
    headingScale: s.headingScale, accentColor: s.accentColor,
    bodyColor: s.bodyColor, headingColor: s.headingColor,
    h1BorderBottom: s.h1BorderBottom, h2BorderBottom: s.h2BorderBottom,
    centerH1: s.centerH1, blockquoteBg: s.blockquoteBg,
    blockquoteBorderColor: s.blockquoteBorderColor, codeBackground: s.codeBackground,
    codeFontSize: s.codeFontSize, codeTheme: s.codeTheme, tableHeaderBg: s.tableHeaderBg,
    tableStriped: s.tableStriped, pageBackground: s.pageBackground,
    marginTop: s.marginTop, marginBottom: s.marginBottom,
    marginLeft: s.marginLeft, marginRight: s.marginRight,
  };
}

/** Collects MathJax's injected stylesheets for inclusion in shadow DOMs and
 *  the export HTML.  Targets `MJX-` prefixed IDs to avoid capturing unrelated
 *  theme stylesheets that Obsidian injects into the document head. */
function getMathJaxCSS(): string {
  return Array.from(
    activeDocument.head.querySelectorAll<HTMLStyleElement>("style[id^='MJX-']"),
  ).map((el) => el.textContent ?? "").join("\n");
}

// ─── Paginator ────────────────────────────────────────────────────────────────
// Measures block children of the rendered HTML in a hidden, scoped sandbox and
// distributes them into page buckets.  Oversized elements are split by their
// natural unit: line for PRE, row for TABLE, item for UL/OL, word for text nodes.

const INLINE_SPLIT_TAGS = new Set(["P", "LI", "BLOCKQUOTE", "TD", "TH"]);

const BLOCK_TAGS = new Set([
  "P", "DIV", "SECTION", "ARTICLE", "ASIDE", "NAV", "HEADER", "FOOTER",
  "UL", "OL", "LI", "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TD", "TH",
  "PRE", "BLOCKQUOTE", "HR", "IMG",
  "H1", "H2", "H3", "H4", "H5", "H6",
]);

// PRE is absent — it gets its own line-based splitter.
const UNSPLITTABLE_TAGS = new Set([
  "CODE", "IMG", "HR", "H1", "H2", "H3", "H4", "H5", "H6",
]);

// 2px guards against sub-pixel rendering differences between the light-DOM
// paginator sandbox and the shadow DOM preview context.
const HEIGHT_EPS = 2;

function measureNodesHeight(nodes: HTMLElement[], measureEl: HTMLElement): number {
  measureEl.empty();
  for (const node of nodes) measureEl.appendChild(node.cloneNode(true));
  return measureEl.getBoundingClientRect().height;
}

function makeFitFn(
  currentPage: HTMLElement[],
  measureEl: HTMLElement,
  contentHeightPx: number,
): (node: HTMLElement) => boolean {
  return (node: HTMLElement) =>
    measureNodesHeight([...currentPage, node], measureEl) <= contentHeightPx - HEIGHT_EPS;
}

// ── Inline (text) splitter ───────────────────────────────────────────────────

function trimLeadingWhitespace(el: HTMLElement): void {
  const walker = activeDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const trimmed = (node.textContent ?? "").replace(/^\s+/, "");
    if (trimmed !== node.textContent) node.textContent = trimmed;
    if (trimmed.length > 0) break;
  }
}

function buildInlineSplitAt(
  el: HTMLElement,
  splitOffset: number,
): [HTMLElement, HTMLElement] | null {
  const walker = activeDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let count = 0;
  let target: Text | null = null;
  let localOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const len = node.textContent?.length ?? 0;
    if (count + len >= splitOffset) {
      target = node;
      localOffset = splitOffset - count;
      break;
    }
    count += len;
  }

  if (!target) return null;

  const range1 = activeDocument.createRange();
  range1.selectNodeContents(el);
  range1.setEnd(target, localOffset);

  const range2 = activeDocument.createRange();
  range2.selectNodeContents(el);
  range2.setStart(target, localOffset);

  const first = el.cloneNode(false) as HTMLElement;
  first.appendChild(range1.cloneContents());

  const second = el.cloneNode(false) as HTMLElement;
  second.appendChild(range2.cloneContents());
  trimLeadingWhitespace(second);

  return [first, second];
}

function getWordBoundaryOffsets(text: string): number[] {
  const offsets: number[] = [];
  const re = /\s+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > 0 && match.index < text.length) offsets.push(match.index);
  }
  return offsets;
}

function splitInlineElement(
  el: HTMLElement,
  fits: (node: HTMLElement) => boolean,
  forceSplit: boolean,
): [HTMLElement, HTMLElement] | null {
  const text = el.textContent ?? "";
  if (text.length < 2) return null;

  // First attempt: binary-search for the latest word boundary that fits.
  const offsets = getWordBoundaryOffsets(text);
  if (offsets.length > 0) {
    let lo = 0, hi = offsets.length - 1, bestIdx = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const split = buildInlineSplitAt(el, offsets[mid]);
      if (!split) { hi = mid - 1; continue; }
      if (fits(split[0])) { bestIdx = mid; lo = mid + 1; }
      else                { hi = mid - 1; }
    }
    if (bestIdx >= 0) return buildInlineSplitAt(el, offsets[bestIdx]);
    if (!forceSplit) return null;
  }

  // Fallback: character-level binary search (oversized single word, or forced).
  let lo = 1, hi = text.length - 1, best = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const split = buildInlineSplitAt(el, mid);
    if (!split) { hi = mid - 1; continue; }
    if (fits(split[0])) { best = mid; lo = mid + 1; }
    else                { hi = mid - 1; }
  }
  return best > 0 ? buildInlineSplitAt(el, best) : null;
}

// ── List splitter ────────────────────────────────────────────────────────────

function buildListWithItems(listEl: HTMLElement, items: HTMLElement[], startAt?: number): HTMLElement {
  const clone = listEl.cloneNode(false) as HTMLElement;
  // Preserve OL numbering across page breaks.
  if (listEl.tagName === "OL" && startAt !== undefined && startAt > 1) {
    (clone as HTMLOListElement).start = startAt;
  }
  for (const item of items) clone.appendChild(item.cloneNode(true));
  return clone;
}

function splitListElement(
  listEl: HTMLElement,
  fits: (node: HTMLElement) => boolean,
  forceSplit: boolean,
): [HTMLElement, HTMLElement] | null {
  const items = Array.from(listEl.children).filter(
    (c) => (c as HTMLElement).tagName === "LI",
  ) as HTMLElement[];
  if (items.length === 0) return null;

  // Respect an existing start attribute on continuation fragments.
  const existingStart = listEl.tagName === "OL"
    ? ((listEl as HTMLOListElement).start ?? 1)
    : 1;

  let fitCount = 0;
  for (let i = 0; i < items.length; i++) {
    if (fits(buildListWithItems(listEl, items.slice(0, i + 1), existingStart))) fitCount = i + 1;
    else break;
  }

  // When forced (alone on empty page), guarantee at least 1 item moves forward.
  if (fitCount <= 0) {
    if (!forceSplit || items.length < 2) return null;
    fitCount = 1;
  }
  if (fitCount >= items.length) return null;

  return [
    buildListWithItems(listEl, items.slice(0, fitCount), existingStart),
    // Second fragment starts at existingStart + fitCount so numbering is continuous.
    buildListWithItems(listEl, items.slice(fitCount), existingStart + fitCount),
  ];
}

// ── Table splitter ───────────────────────────────────────────────────────────

function buildTableWithRows(tableEl: HTMLTableElement, rows: HTMLTableRowElement[]): HTMLTableElement {
  const clone = tableEl.cloneNode(false) as HTMLTableElement;
  const caption = tableEl.querySelector("caption");
  if (caption) clone.appendChild(caption.cloneNode(true));
  const colgroup = tableEl.querySelector("colgroup");
  if (colgroup) clone.appendChild(colgroup.cloneNode(true));
  if (tableEl.tHead) clone.appendChild(tableEl.tHead.cloneNode(true));
  const tbody = activeDocument.createElement("tbody");
  for (const row of rows) tbody.appendChild(row.cloneNode(true));
  clone.appendChild(tbody);
  return clone;
}

function splitTableElement(
  tableEl: HTMLTableElement,
  fits: (node: HTMLElement) => boolean,
  forceSplit: boolean,
): [HTMLElement, HTMLElement] | null {
  const body = tableEl.tBodies[0];
  const rows = body
    ? Array.from(body.rows)
    : Array.from(tableEl.rows).filter((r) => r.parentElement?.tagName !== "THEAD");
  if (rows.length === 0) return null;

  let fitCount = 0;
  for (let i = 0; i < rows.length; i++) {
    if (fits(buildTableWithRows(tableEl, rows.slice(0, i + 1)))) fitCount = i + 1;
    else break;
  }

  // When forced (alone on empty page), guarantee at least 1 row moves forward.
  if (fitCount <= 0) {
    if (!forceSplit || rows.length < 2) return null;
    fitCount = 1;
  }
  if (fitCount >= rows.length) return null;

  return [
    buildTableWithRows(tableEl, rows.slice(0, fitCount)),
    buildTableWithRows(tableEl, rows.slice(fitCount)),
  ];
}

// ── PRE splitter ─────────────────────────────────────────────────────────────
// Splits by lines, preserving the inner <code> wrapper for correct styling.

function buildPreWithLines(preEl: HTMLElement, lines: string[]): HTMLElement {
  const clone = preEl.cloneNode(false) as HTMLElement;
  const codeEl = preEl.querySelector("code");
  if (codeEl) {
    const codeClone = codeEl.cloneNode(false) as HTMLElement;
    codeClone.textContent = lines.join("\n");
    clone.appendChild(codeClone);
  } else {
    clone.textContent = lines.join("\n");
  }
  return clone;
}

function splitPreElement(
  preEl: HTMLElement,
  fits: (node: HTMLElement) => boolean,
  forceSplit: boolean,
): [HTMLElement, HTMLElement] | null {
  const lines = (preEl.textContent ?? "").split("\n");
  // Drop the trailing empty string that String.split() produces.
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  if (lines.length < 2) return null;

  let fitCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (fits(buildPreWithLines(preEl, lines.slice(0, i + 1)))) fitCount = i + 1;
    else break;
  }

  if (fitCount <= 0) {
    if (!forceSplit || lines.length < 2) return null;
    fitCount = 1;
  }
  if (fitCount >= lines.length) return null;

  // buildPreWithLines rebuilds the <code> from plain text (shallow clone), which
  // drops the hljs token spans. Re-highlight each final piece so split code
  // blocks stay coloured. The measurement candidates above stay plain — token
  // spans are inline and don't affect height, so the fit decision is unchanged.
  const head = buildPreWithLines(preEl, lines.slice(0, fitCount));
  const tail = buildPreWithLines(preEl, lines.slice(fitCount));
  for (const piece of [head, tail]) {
    const codeEl = piece.querySelector("code");
    if (codeEl) highlightCodeBlock(codeEl as HTMLElement);
  }
  return [head, tail];
}

// ── Element splitter dispatcher ──────────────────────────────────────────────

function isInlineSplitCandidate(el: HTMLElement): boolean {
  if (!INLINE_SPLIT_TAGS.has(el.tagName)) return false;
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((child as HTMLElement).tagName))
      return false;
  }
  return true;
}

function splitElement(
  el: HTMLElement,
  fits: (node: HTMLElement) => boolean,
  forceSplit: boolean,
): [HTMLElement, HTMLElement] | null {
  if (UNSPLITTABLE_TAGS.has(el.tagName)) return null;
  if (el.tagName === "PRE")   return splitPreElement(el, fits, forceSplit);
  if (el.tagName === "TABLE") return splitTableElement(el as HTMLTableElement, fits, forceSplit);
  if (el.tagName === "UL" || el.tagName === "OL") return splitListElement(el, fits, forceSplit);
  if (isInlineSplitCandidate(el)) return splitInlineElement(el, fits, forceSplit);
  return null;
}

// ── Main pagination loop ─────────────────────────────────────────────────────

function paginateEl(
  sourceEl: HTMLElement,
  contentWidthPx: number,
  contentHeightPx: number,
  docCSS: string,
): HTMLElement[][] {
  // Off-screen shadow-root sandbox: CSS is fully scoped so it never pollutes
  // the host document, and adoptedStyleSheets keeps the shadow tree clean.
  const sandboxHost = activeDocument.createElement("div");
  sandboxHost.setCssStyles({
    position: "fixed", top: "0", left: "-99999px",
    width: `${contentWidthPx}px`,
    visibility: "hidden", pointerEvents: "none", zIndex: "-1",
  });

  const sandboxShadow = sandboxHost.attachShadow({ mode: "open" });

  const sandboxSheet = new CSSStyleSheet();
  sandboxSheet.replaceSync(docCSS);
  sandboxShadow.adoptedStyleSheets = [sandboxSheet];

  const inner = activeDocument.createElement("div");
  inner.className = "mpdf-doc";
  for (const child of Array.from(sourceEl.children)) {
    inner.appendChild(child.cloneNode(true));
  }
  sandboxShadow.appendChild(inner);

  // Measurement div: same width, always empty before each measurement.
  const measure = activeDocument.createElement("div");
  measure.className = "mpdf-doc";
  measure.setCssStyles({ position: "absolute", top: "0", left: "0", width: `${contentWidthPx}px`, visibility: "hidden" });
  sandboxShadow.appendChild(measure);

  activeDocument.body.appendChild(sandboxHost);

  const pages: HTMLElement[][] = [];
  try {
    let currentPage: HTMLElement[] = [];
    const children = Array.from(inner.children) as HTMLElement[];
    let idx = 0;

    while (idx < children.length) {
      const child = children[idx];
      const fits = makeFitFn(currentPage, measure, contentHeightPx);

      if (fits(child)) {
        currentPage.push(child.cloneNode(true) as HTMLElement);
        idx++;
        continue;
      }

      // Element doesn't fit. Try to split it across the page boundary.
      const forceSplit = currentPage.length === 0;
      const split = splitElement(child, fits, forceSplit);
      if (split) {
        currentPage.push(split[0]);
        pages.push(currentPage);
        currentPage = [];
        // Replace current child with the remainder for re-processing.
        const remainder = split[1];
        if (remainder.textContent?.trim() || remainder.children.length > 0) {
          children[idx] = remainder;
        } else {
          idx++;
        }
        continue;
      }

      // Can't split. If there's content on this page, flush it and retry the
      // same element on a fresh full-height page.
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        continue;
      }

      // Element is alone on an empty page and truly unsplittable (e.g. a giant
      // image). Force it onto its own page and advance so we never stall.
      currentPage.push(child.cloneNode(true) as HTMLElement);
      pages.push(currentPage);
      currentPage = [];
      idx++;
    }

    if (currentPage.length > 0) pages.push(currentPage);
  } finally {
    activeDocument.body.removeChild(sandboxHost);
  }
  return pages.length > 0 ? pages : [[]];
}

// ─── Page layout builder ──────────────────────────────────────────────────────

/** Converts paginated page-node arrays into fully-resolved PageLayout objects,
 *  computing header/footer text and page number strings for each page. */
function buildPageLayouts(allPages: HTMLElement[][], s: PDFExportSettings): PageLayout[] {
  const totalPages = allPages.length;
  return allPages.map((pageNodes, i) => {
    const pageNum = i + 1;
    const showHF = s.showHeaderFooterOnFirstPage || i > 0;

    // Page number display: when first-page HF is disabled the offset shifts by 1.
    const displayNum = s.showHeaderFooterOnFirstPage
      ? s.pageNumberStart + i
      : s.pageNumberStart + (i - 1);
    const displayTotal = s.showHeaderFooterOnFirstPage
      ? s.pageNumberStart + totalPages - 1
      : s.pageNumberStart + totalPages - 2;
    const numStr = `${displayNum} / ${displayTotal}`;

    let footerLeft = "", footerRight = "", footerCenter = "";
    let headerLeft = "", headerCenter = "", headerRight = "";

    if (showHF) {
      if (s.showPageNumbers) {
        if (s.pageNumberPosition === "center") {
          footerCenter = (s.footerText ? s.footerText + " — " : "") + numStr;
        } else if (s.pageNumberPosition === "left") {
          footerLeft  = numStr;
          footerRight = s.footerText ?? "";
        } else {
          footerLeft  = s.footerText ?? "";
          footerRight = numStr;
        }
      } else {
        footerLeft = s.footerText ?? "";
      }

      if (s.headerText) {
        if (s.headerAlignment === "center") {
          headerCenter = s.headerText;
        } else if (s.headerAlignment === "left") {
          headerLeft = s.headerText;
        } else {
          headerRight = s.headerText;
        }
      }
    }

    return { pageNodes, pageNum, totalPages, headerLeft, headerCenter, headerRight, footerLeft, footerRight, footerCenter };
  });
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class MarkdownPDFPlugin extends Plugin {
  declare settings: PDFExportSettings;
  activeModal: PDFExportModal | null = null;
  presetSnapshots: Record<string, DocStyle> = {};

  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "open-panel",
      name: "Open Panel",
      callback: () => this.openModal(),
    });
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu: Menu, file) => {
        if (!(file instanceof TFile) || file.extension !== "md") return;
        menu.addItem((item) =>
          item.setTitle("Advanced PDF Export: Open Panel").setIcon("file-output")
              .onClick(() => this.openModal(file)),
        );
      }),
    );
    this.addSettingTab(new PDFExportSettingTab(this.app, this));
  }

  onunload() {
    this.activeModal?.close();
  }

  openModal(file?: TFile) {
    if (this.activeModal) this.activeModal.close();
    new PDFExportModal(this.app, this, file).open();
  }

  async loadSettings() {
    const data = (await this.loadData() ?? {}) as Partial<PDFExportSettings> & { presetSnapshots?: Record<string, DocStyle> };
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    this.presetSnapshots = data.presetSnapshots ?? {};
  }

  async saveSettings() {
    await this.saveData({ ...this.settings, presetSnapshots: this.presetSnapshots });
  }

  async saveSettingsAndRender() {
    await this.saveSettings();
    this.activeModal?.render();
  }

  applyPreset(key: string, reset = false) {
    const p = PRESETS[key];
    if (!p) return;
    if (reset) {
      delete this.presetSnapshots[key];
    } else {
      this.presetSnapshots[this.settings.preset] = extractDocStyle(this.settings);
    }
    this.settings.preset = key;
    Object.assign(this.settings, p, reset ? {} : (this.presetSnapshots[key] ?? {}));
  }
}

// ─── File resolver ────────────────────────────────────────────────────────────

// Four-level cascade: explicit file → active MarkdownView → active file → most recent leaf.
function resolveActiveMarkdownFile(app: App, initialFile?: TFile | null): TFile | null {
  if (initialFile) return initialFile;

  const fromView = app.workspace.getActiveViewOfType(MarkdownView)?.file;
  if (fromView) return fromView;

  const activeFile = app.workspace.getActiveFile();
  if (activeFile?.extension === "md") return activeFile;

  const leaf = app.workspace.getMostRecentLeaf();
  if (leaf?.view instanceof MarkdownView) return leaf.view.file ?? null;

  return null;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

class PDFExportModal extends Modal {
  plugin: MarkdownPDFPlugin;
  private editorEl: HTMLTextAreaElement;
  private previewEl: HTMLElement;
  private pageCountEl: HTMLElement;
  private noteTitleEl: HTMLElement;
  private renderBtn!: HTMLButtonElement;
  private exportBtn!: HTMLButtonElement;
  private loadingOverlayEl!: HTMLElement;

  // Owned Component for MarkdownRenderer — loaded on open, unloaded on close.
  private renderComponent = new Component();

  private readonly initialFile: TFile | null;
  private currentFile: TFile | null = null;
  private renderToken = 0;
  private layoutCache: LayoutCache | null = null;
  // Debounce handle for settings-driven re-renders; cleared on close.
  private renderDebounceTimer: number | null = null;

  constructor(app: App, plugin: MarkdownPDFPlugin, file?: TFile) {
    super(app);
    this.plugin = plugin;
    this.initialFile = file ?? null;
  }

  async onOpen() {
    this.plugin.activeModal = this;
    this.renderComponent.load();
    this.modalEl.addClass("mpdf-modal");
    this.buildUI(this.contentEl);

    const file = resolveActiveMarkdownFile(this.app, this.initialFile);

    if (file) {
      this.currentFile = file;
      const content = await this.app.vault.read(file);
      this.editorEl.value = content;
      this.noteTitleEl.textContent = file.basename;
      this.noteTitleEl.title = file.path;
      this.showLoading();
      // Two rAFs: spinner renders before the synchronous pagination work blocks the thread.
      await new Promise<void>((r) => window.requestAnimationFrame(() => window.requestAnimationFrame(() => r())));
      this.render(true);
    }
  }

  onClose() {
    if (this.renderDebounceTimer !== null) {
      window.clearTimeout(this.renderDebounceTimer);
      this.renderDebounceTimer = null;
    }
    this.renderComponent.unload();
    this.plugin.activeModal = null;
    this.currentFile        = null;
    this.layoutCache        = null;
  }

  // ── UI ──────────────────────────────────────────────────────────────────────

  private buildUI(container: HTMLElement) {
    const s = this.plugin.settings;
    this.buildTopbar(container.createEl("div", { cls: "mpdf-topbar" }), s);

    const main = container.createEl("div", { cls: "mpdf-main" });

    const editorPanel = main.createEl("div", { cls: "mpdf-editor-panel" });

    this.editorEl = editorPanel.createEl("textarea", { cls: "mpdf-editor" });
    this.editorEl.placeholder =
      "Type or paste markdown here to preview and export as PDF.\n\n" +
      "Tip: open this panel from a note's right-click menu, command palette,\n" +
      "or keyboard shortcut to auto-load the active note.\n\n" +
      "Use /// on its own line for a manual page break.\n" +
      "Use --- for a horizontal rule.\n\n" +
      "Mermaid diagrams are supported:\n```mermaid\nflowchart LR\n  A --> B --> C\n```\n\n" +
      "Markdown tables:\n| Col A | Col B |\n|-------|-------|\n| Cell  | Cell  |";

    // Preview container keeps the loading overlay fixed (non-scrolling) over the panel.
    const previewContainer = main.createEl("div", { cls: "mpdf-preview-container" });
    this.previewEl = previewContainer.createEl("div", { cls: "mpdf-preview" });

    this.loadingOverlayEl = previewContainer.createEl("div", { cls: "mpdf-loading-overlay" });
    this.loadingOverlayEl.createEl("div", { cls: "mpdf-spinner" });
    this.loadingOverlayEl.createEl("span", { cls: "mpdf-loading-text", text: "Rendering…" });

    this.editorEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.render(true);
      }
    });
  }

  private buildTopbar(topbar: HTMLElement, s: PDFExportSettings) {
    const left  = topbar.createEl("div", { cls: "mpdf-topbar-left" });
    this.noteTitleEl = topbar.createEl("div", { cls: "mpdf-topbar-title", text: "—" });
    const right = topbar.createEl("div", { cls: "mpdf-topbar-right" });

    const makeSelect = (
      label: string,
      opts: Record<string, string>,
      val: string,
      cb: (v: string) => Promise<void>,
    ) => {
      const wrap = left.createEl("div", { cls: "mpdf-ctrl" });
      wrap.createEl("span", { cls: "mpdf-ctrl-label", text: label });
      const el = wrap.createEl("select", { cls: "mpdf-select" });
      for (const [v, t] of Object.entries(opts)) {
        const o = el.createEl("option", { text: t, value: v });
        if (v === val) o.selected = true;
      }
      el.addEventListener("change", () => void cb(el.value));
    };

    const presetOpts: Record<string, string> = {};
    Object.entries(PRESETS).forEach(([k, v]) => (presetOpts[k] = v.name));
    makeSelect("Style", presetOpts, s.preset, async (v) => {
      this.plugin.applyPreset(v);
      await this.plugin.saveSettingsAndRender();
    });

    const sizeOpts: Record<string, string> = {};
    Object.keys(PAGE_SIZES).forEach((k) => (sizeOpts[k] = k));
    makeSelect("Size", sizeOpts, s.pageSize, async (v) => {
      this.plugin.settings.pageSize = v;
      await this.plugin.saveSettingsAndRender();
    });

    makeSelect("Orient", { portrait: "Portrait", landscape: "Landscape" }, s.orientation,
      async (v) => {
        this.plugin.settings.orientation = v as "portrait" | "landscape";
        await this.plugin.saveSettingsAndRender();
      },
    );

    const zoomWrap = left.createEl("div", { cls: "mpdf-ctrl" });
    zoomWrap.createEl("span", { cls: "mpdf-ctrl-label", text: "Zoom" });
    const zoomLabel = zoomWrap.createEl("span", {
      cls: "mpdf-ctrl-label",
      text: Math.round(s.previewScale * 100) + "%",
    });
    const zoomSlider = zoomWrap.createEl("input");
    zoomSlider.type  = "range";
    zoomSlider.min   = "0.35";
    zoomSlider.max   = "1.0";
    zoomSlider.step  = "0.05";
    zoomSlider.value = String(s.previewScale);
    zoomSlider.addClass("mpdf-zoom-slider");
    zoomSlider.addEventListener("input", () => {
      const v = parseFloat(zoomSlider.value);
      this.plugin.settings.previewScale = v;
      zoomLabel.textContent = Math.round(v * 100) + "%";
      void this.plugin.saveSettings().then(() => { this.renderPreviewOnly(); });
    });

    const breakBtn = left.createEl("button", { cls: "mpdf-btn", text: "Insert Page Break" });
    breakBtn.title = "Insert page break (///)";
    breakBtn.addEventListener("click", () => this.insertAtCursor("\n///\n"));

    this.pageCountEl = right.createEl("span", { cls: "mpdf-page-count", text: "— pages" });

    const settingsBtn = right.createEl("button", { cls: "mpdf-btn mpdf-btn-icon" });
    settingsBtn.setAttr("aria-label", "Open Advanced PDF Export settings");
    setIcon(settingsBtn, "settings");
    settingsBtn.addEventListener("click", () => {
      const settings = (this.app as App & AppWithSettings).setting;
      settings?.open?.();
      settings?.openTabById?.("advanced-pdf-export");
    });

    this.renderBtn = right.createEl("button", { cls: "mpdf-btn", text: "⟳ Render PDF" });
    this.renderBtn.title = "Render preview (Ctrl+Enter)";
    this.renderBtn.addEventListener("click", () => this.render(true));

    this.exportBtn = right.createEl("button", { cls: "mpdf-btn mpdf-btn-primary", text: "⬇ Export PDF" });
    this.exportBtn.addEventListener("click", () => void this.exportPDF());
  }

  private insertAtCursor(text: string) {
    const ta    = this.editorEl;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.focus();
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  // immediate=true  → run on the next frame (button click, Ctrl+Enter, onOpen).
  // immediate=false → debounce 150 ms (settings panel changes).
  render(immediate = false) {
    const token = ++this.renderToken;
    if (this.renderDebounceTimer !== null) {
      window.clearTimeout(this.renderDebounceTimer);
      this.renderDebounceTimer = null;
    }
    this.showLoading();

    const safeDo = () =>
      this.doRender(token).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[advanced-pdf-export] render error:", err);
        this.hideLoading();
        new Notice("Render error: " + msg);
      });

    if (immediate) {
      // Two rAFs: the first fires before paint, the second after — the spinner
      // must be visible before the synchronous pagination work blocks the thread.
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => void safeDo()));
    } else {
      this.renderDebounceTimer = window.setTimeout(() => {
        this.renderDebounceTimer = null;
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => void safeDo()));
      }, 150);
    }
  }

  // Inserts `///` before H1/H2 headings, skipping headings inside fenced
  // code blocks and the very first heading in the document.
  private static insertAutoBreaks(
    md: string,
    breakH1: boolean,
    breakH2: boolean,
  ): string {
    if (!breakH1 && !breakH2) return md;

    const lines = md.split("\n");
    const out: string[] = [];
    let inFence = false;
    let fenceMarker = "";

    for (const line of lines) {
      if (!inFence) {
        const open = line.match(/^(`{3,}|~{3,})/);
        if (open) {
          inFence     = true;
          fenceMarker = open[1];
        } else if (out.length > 0) {
          if      (breakH1 && /^# /.test(line))  out.push("///");
          else if (breakH2 && /^## /.test(line)) out.push("///");
        }
      } else {
        // Close fence: same character, at least as long.
        const close = line.match(/^(`{3,}|~{3,})\s*$/);
        if (
          close &&
          close[1][0] === fenceMarker[0] &&
          close[1].length >= fenceMarker.length
        ) {
          inFence     = false;
          fenceMarker = "";
        }
      }
      out.push(line);
    }

    return out.join("\n");
  }

  private async doRender(token: number) {
    const s = this.plugin.settings;
    let md = normalizeMarkdown(this.editorEl.value);

    if (s.hideFrontmatter) {
      md = stripFrontmatter(md);
    }

    if (s.includeFilenameAsTitle && this.currentFile) {
      md = `# ${this.currentFile.basename}\n\n${md}`;
    }

    md = PDFExportModal.insertAutoBreaks(md, s.autoBreakH1, s.autoBreakH2);

    const sections = splitMarkdownSections(md);
    const dims = PAGE_SIZES[s.pageSize] ?? PAGE_SIZES["A4"];
    const pw = s.orientation === "landscape" ? dims.h : dims.w;
    const ph = s.orientation === "landscape" ? dims.w : dims.h;

    const mTop    = mmToPx(s.marginTop);
    const mBottom = mmToPx(s.marginBottom);
    const mLeft   = mmToPx(s.marginLeft);
    const mRight  = mmToPx(s.marginRight);
    const footerH = s.showFooter ? 28 : 0;
    const headerH = s.showHeader && s.headerText ? 20 : 0;
    // Clamp to at least 1 px so the paginator sandbox never has zero dimensions.
    const contentW = Math.max(1, pw - mLeft - mRight);
    const contentH = Math.max(1, ph - mTop - mBottom - footerH - headerH);
    const isRTL    = isRTLContent(this.editorEl.value);
    const docCSS   = buildDocCSS(s, isRTL);
    const sourcePath = this.currentFile?.path ?? "pdf-export";

    const sectionEls = await Promise.all(
      sections.map((sec) => renderMarkdownToEl(this.app, sec, sourcePath, this.renderComponent)),
    );

    if (token !== this.renderToken) return;

    // Forward MathJax styles so math renders correctly in shadow DOMs and export HTML.
    const mathCSS = getMathJaxCSS();
    const fullCSS = mathCSS ? `${mathCSS}\n${docCSS}` : docCSS;

    const allPages: HTMLElement[][] = [];
    for (const sectionEl of sectionEls) {
      allPages.push(...paginateEl(sectionEl, contentW, contentH, fullCSS));
    }

    const layouts = buildPageLayouts(allPages, s);
    const resolvedFont = s.fontFamily === "__custom__" ? (s.customFontName.trim() || "inherit") : s.fontFamily;
    this.layoutCache = { layouts, pw, ph, mTop, mLeft, mRight, footerH, headerH, contentW, contentH, docCSS: fullCSS, fontFamily: resolvedFont, accentColor: s.accentColor, pageBackground: s.pageBackground, isRTL };

    this.drawPreview(this.layoutCache, s.previewScale);
    this.pageCountEl.textContent = `${layouts.length} page${layouts.length !== 1 ? "s" : ""}`;
    this.hideLoading();
  }

  private renderPreviewOnly() {
    if (!this.layoutCache) return;
    this.drawPreview(this.layoutCache, this.plugin.settings.previewScale);
  }

  private showLoading() {
    this.loadingOverlayEl.addClass("is-active");
    this.renderBtn.disabled = true;
    this.renderBtn.textContent = "Rendering…";
  }

  private hideLoading() {
    this.loadingOverlayEl.removeClass("is-active");
    this.renderBtn.disabled = false;
    this.renderBtn.textContent = "⟳ Render PDF";
  }

  private drawPreview(c: LayoutCache, scale: number) {
    const { layouts, pw, ph, mTop, mLeft, mRight, footerH, headerH, contentW, docCSS, fontFamily, accentColor, pageBackground, isRTL } = c;
    const s = this.plugin.settings;
    this.previewEl.empty();

    // Map heading IDs → page-wrap index for in-preview anchor scrolling.
    const idToWrapIndex = new Map<string, number>();
    layouts.forEach((layout, i) => {
      for (const node of layout.pageNodes) {
        node.querySelectorAll("[id]").forEach((el) => {
          if (!idToWrapIndex.has(el.id)) idToWrapIndex.set(el.id, i);
        });
        if (node.id && !idToWrapIndex.has(node.id)) idToWrapIndex.set(node.id, i);
      }
    });

    const pageWraps: HTMLElement[] = [];

    // All pages share identical CSS — build once and adopt by reference in each shadow root.
    const shadowCSS = `
      :host {
        display: block;
        width: ${pw}px;
        height: ${ph}px;
        background: ${pageBackground};
        box-shadow: 0 2px 8px rgba(0,0,0,.30), 0 8px 32px rgba(0,0,0,.25);
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
      }
      *, *::before, *::after { box-sizing: border-box; }
      .mpdf-hf-center { flex: 1; text-align: center; }
      .mpdf-hf-right { margin-left: auto; }
      ${docCSS}
    `;
    const pageSheet = new CSSStyleSheet();
    pageSheet.replaceSync(shadowCSS);

    for (const layout of layouts) {
      const scaledW = Math.round(pw * scale);
      const scaledH = Math.round(ph * scale);

      const wrap = this.previewEl.createEl("div", { cls: "mpdf-page-wrap" });
      wrap.setCssStyles({ width: `${scaledW}px`, height: `${scaledH}px` });
      wrap.createEl("div", { cls: "mpdf-page-label", text: `Page ${layout.pageNum} of ${layout.totalPages}` });
      pageWraps.push(wrap);

      const scaleWrap = wrap.createEl("div", { cls: "mpdf-page-scale" });
      scaleWrap.setCssStyles({ width: `${scaledW}px`, height: `${scaledH}px` });

      // Each page renders inside a shadow root so Obsidian's theme CSS cannot
      // reach the page content across the shadow boundary.
      const shadowHost = activeDocument.createElement("div");
      shadowHost.addClass("mpdf-shadow-host");
      shadowHost.setCssStyles({ width: `${pw}px`, height: `${ph}px`, transform: `scale(${scale})` });
      scaleWrap.appendChild(shadowHost);

      const shadow = shadowHost.attachShadow({ mode: "open" });
      shadow.adoptedStyleSheets = [pageSheet];

      // ── Header ───────────────────────────────────────────────────────────────
      const hasHeader = s.showHeader && (layout.headerLeft || layout.headerCenter || layout.headerRight);
      if (hasHeader) {
        const hdr = activeDocument.createElement("div");
        hdr.setCssStyles({
          position: "absolute", top: `${mTop * 0.4}px`, left: `${mLeft}px`, right: `${mRight}px`,
          display: "flex", alignItems: "center",
          fontSize: "9px", color: "#999", fontFamily: fontFamily, whiteSpace: "nowrap",
        });
        if (layout.headerCenter) {
          const span = activeDocument.createElement("span");
          span.className = "mpdf-hf-center";
          span.textContent = layout.headerCenter;
          hdr.appendChild(span);
        } else {
          const leftSpan = activeDocument.createElement("span");
          leftSpan.textContent = layout.headerLeft;
          hdr.appendChild(leftSpan);
          const rightSpan = activeDocument.createElement("span");
          rightSpan.className = "mpdf-hf-right";
          rightSpan.textContent = layout.headerRight;
          hdr.appendChild(rightSpan);
        }
        shadow.appendChild(hdr);
      }

      // ── Content ──────────────────────────────────────────────────────────────
      const contentDiv = activeDocument.createElement("div");
      contentDiv.className = "mpdf-doc";
      if (isRTL) contentDiv.setAttribute("dir", "rtl");
      // No explicit height or overflow:hidden — :host clips at the page edge.
      // Adding a second clip here caused bottom lines to be cut off in preview
      // due to sub-pixel rounding differences between the paginator sandbox
      // (light DOM) and the shadow DOM rendering context.
      contentDiv.setCssStyles({
        position: "absolute", top: `${mTop + headerH}px`, left: `${mLeft}px`,
        width: `${contentW}px`,
      });
      for (const node of layout.pageNodes) contentDiv.appendChild(node.cloneNode(true));
      shadow.appendChild(contentDiv);

      // Wire internal anchor links via light-DOM page-wrap scrollIntoView.
      contentDiv.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((a) => {
        const targetId = decodeURIComponent(a.getAttribute("href")!.slice(1));
        const wrapIdx  = idToWrapIndex.get(targetId);
        if (wrapIdx !== undefined) {
          a.title = `Go to page ${wrapIdx + 1}`;
          a.addEventListener("click", (e) => {
            e.preventDefault();
            pageWraps[wrapIdx]?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      });

      // ── Footer ───────────────────────────────────────────────────────────────
      // Skip empty footer divs (e.g. page 1 when showHeaderFooterOnFirstPage is off).
      const hasFooter = s.showFooter && (layout.footerLeft || layout.footerRight || layout.footerCenter);
      if (hasFooter) {
        const footer = activeDocument.createElement("div");
        footer.setCssStyles({
          position: "absolute", bottom: "0", left: "0", right: "0",
          height: `${footerH}px`, display: "flex", alignItems: "center",
          ...(s.showFooterBorder ? { borderTop: `0.5px solid ${accentColor}33` } : {}),
          padding: `0 ${mRight}px 0 ${mLeft}px`, fontSize: "9px", color: "#aaa", fontFamily: fontFamily,
        });

        if (layout.footerCenter) {
          const span = activeDocument.createElement("span");
          span.className = "mpdf-hf-center";
          span.textContent = layout.footerCenter;
          footer.appendChild(span);
        } else {
          const left = activeDocument.createElement("span");
          left.textContent = layout.footerLeft;
          footer.appendChild(left);
          const right = activeDocument.createElement("span");
          right.className = "mpdf-hf-right";
          right.textContent = layout.footerRight;
          footer.appendChild(right);
        }
        shadow.appendChild(footer);
      }
    }
  }

  // ── Export ──────────────────────────────────────────────────────────────────

  private async exportPDF() {
    const s = this.plugin.settings;

    this.exportBtn.disabled = true;
    this.exportBtn.textContent = "⬇ Exporting…";

    const resetExportBtn = () => {
      this.exportBtn.disabled = false;
      this.exportBtn.textContent = "⬇ Export PDF";
    };

    // Ensure we have a layout — run a full render if the modal was just opened.
    // The export button is already disabled, so no paint yield is needed.
    if (!this.layoutCache) {
      // Cancel any pending debounced render — this export render supersedes it.
      if (this.renderDebounceTimer !== null) {
        window.clearTimeout(this.renderDebounceTimer);
        this.renderDebounceTimer = null;
      }
      const token = ++this.renderToken;
      this.showLoading();
      try {
        await this.doRender(token);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        new Notice("Render error: " + msg);
        this.hideLoading();
        resetExportBtn();
        return;
      }
    }

    const cache = this.layoutCache;
    if (!cache || cache.layouts.length === 0) {
      new Notice("Nothing to export.");
      resetExportBtn();
      return;
    }

    const { layouts, pw, ph, mTop, mLeft, mRight, footerH, headerH, contentW, docCSS, fontFamily, accentColor: exportAccent, pageBackground, isRTL } = cache;

    const pageHTMLParts = layouts.map((layout) => {
      const contentHTML = layout.pageNodes.map((n) => {
        const clone = n.cloneNode(true) as HTMLElement;
        // Styles inside SVGs are kept — mermaid embeds its theme CSS there.
        clone.querySelectorAll("style, script").forEach((el) => {
          if (!el.closest("svg")) el.remove();
        });
        return clone.outerHTML;
      }).join("\n");

      const hasExportHeader = s.showHeader && (layout.headerLeft || layout.headerCenter || layout.headerRight);
      const headerInnerHTML = layout.headerCenter
        ? `<span style="flex:1;text-align:center;">${escapeHTML(layout.headerCenter)}</span>`
        : `<span>${escapeHTML(layout.headerLeft)}</span><span style="margin-left:auto;">${escapeHTML(layout.headerRight)}</span>`;
      const headerHTML = hasExportHeader
        ? `<div style="position:absolute;top:${mTop * 0.4}px;left:${mLeft}px;right:${mRight}px;display:flex;align-items:center;font-size:9px;color:#999;font-family:${fontFamily};white-space:nowrap;">${headerInnerHTML}</div>`
        : "";

      const footerInnerHTML = layout.footerCenter
        ? `<span style="flex:1;text-align:center;">${escapeHTML(layout.footerCenter)}</span>`
        : `<span>${escapeHTML(layout.footerLeft)}</span><span style="margin-left:auto;">${escapeHTML(layout.footerRight)}</span>`;

      const hasExportFooter = s.showFooter && (layout.footerLeft || layout.footerRight || layout.footerCenter);
      const footerBorder = s.showFooterBorder ? `border-top:0.5px solid ${exportAccent}33;` : "";
      const footerHTML = hasExportFooter
        ? `<div style="position:absolute;bottom:0;left:0;right:0;height:${footerH}px;display:flex;align-items:center;${footerBorder}padding:0 ${mRight}px 0 ${mLeft}px;font-size:9px;color:#aaa;font-family:${fontFamily};">${footerInnerHTML}</div>`
        : "";

      const contentDivHTML = `<div class="mpdf-doc"${isRTL ? ' dir="rtl"' : ''} style="position:absolute;top:${mTop + headerH}px;left:${mLeft}px;width:${contentW}px;">${contentHTML}</div>`;

      return `<div class="mpdf-export-page">${headerHTML}${contentDivHTML}${footerHTML}</div>`;
    });

    const printCSS = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @page { size: ${pw}px ${ph}px; margin: 0; }
      html, body { margin: 0; padding: 0; background: ${pageBackground}; }
      .mpdf-export-page {
        position: relative;
        width: ${pw}px; height: ${ph}px;
        overflow: hidden;
        background: ${pageBackground};
        page-break-after: always; break-after: page;
      }
      .mpdf-export-page:last-child { page-break-after: avoid; break-after: avoid; }
      ${docCSS}
    `;

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHTML(this.currentFile?.basename ?? "Export")}</title>
<style>${escapeCSSForStyle(printCSS)}</style>
</head>
<body>
${pageHTMLParts.join("\n")}
</body>
</html>`;

    try {
      // Obsidian uses @electron/remote; the legacy `electron.remote` property is
      // undefined in the renderer process of modern Electron versions.
      const electron = window as unknown as ElectronBridge;
      const remote = electron.require("@electron/remote") as ElectronRemote | null;
      if (!remote?.dialog) throw new Error("no remote");

      const res = await remote.dialog.showSaveDialog({
        title: "Save PDF",
        defaultPath: (this.currentFile?.basename ?? "export") + ".pdf",
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });
      if (res.canceled || !res.filePath) {
        resetExportBtn();
        return;
      }

      new Notice("Generating PDF…");

      const blob = new Blob([fullHTML], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      const win  = new remote.BrowserWindow({ show: false, webPreferences: { nodeIntegration: false } });

      win.loadURL(url);

      // Both events can fire for the same load — a flag ensures only the first one acts.
      let exportHandled = false;
      const cleanupWin = () => { URL.revokeObjectURL(url); win.close(); resetExportBtn(); };

      win.webContents.once("did-fail-load", (_event: unknown, _code: number, desc: string) => {
        if (exportHandled) return;
        exportHandled = true;
        new Notice("PDF load error: " + desc);
        cleanupWin();
      });

      win.webContents.once("did-finish-load", () => {
        if (exportHandled) return;
        exportHandled = true;
        win.webContents
          .printToPDF({ pageSize: s.pageSize, landscape: s.orientation === "landscape", printBackground: true, margins: { marginType: "none" } })
          .then((data: Buffer) => {
            electron.require("fs").writeFile(res.filePath!, data, (err: Error | null) => {
              if (err) new Notice("Error saving PDF: " + err.message);
              else     new Notice("✓ PDF saved: " + res.filePath);
              cleanupWin();
            });
          })
          .catch((err: Error) => {
            new Notice("PDF render error: " + err.message);
            cleanupWin();
          });
      });
    } catch {
      new Notice("Advanced PDF export requires the Obsidian desktop app.");
      resetExportBtn();
    }
  }
}

// ─── Settings tab ─────────────────────────────────────────────────────────────

class PDFExportSettingTab extends PluginSettingTab {
  plugin: MarkdownPDFPlugin;

  /**
   * Set to `true` whenever the user changes any setting while this tab is open.
   * The live preview modal is re-rendered exactly once when the tab closes,
   * rather than on every individual keystroke or toggle.
   */
  private dirty = false;

  constructor(app: App, plugin: MarkdownPDFPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    // Start fresh: if nothing changes before hide(), no render will happen.
    this.dirty = false;
    this.buildSettings();
  }

  /**
   * Obsidian calls this when the user navigates away from the tab or closes
   * the settings modal.  If any setting was changed we fire a single render
   * now, which is far cheaper than rendering on every keystroke.
   */
  hide(): void {
    if (this.dirty) {
      this.dirty = false;
      this.plugin.activeModal?.render(true);
    }
  }

  private async markDirty(): Promise<void> {
    this.dirty = true;
    await this.plugin.saveSettings();
  }

  /**
   * Builds (or re-builds) the settings UI.  Extracted from `display()` so
   * that preset / reset handlers can refresh the form without resetting the
   * dirty flag back to `false`.
   */
  private buildSettings(): void {
    const { containerEl } = this;
    containerEl.empty();
    const s = this.plugin.settings;

    // ── Style Preset ──────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Style Preset").setHeading();
    new Setting(containerEl)
      .setName("Preset")
      .setDesc("Pick a preset to configure the overall document style. Fine-tune any setting below.")
      .addDropdown((d) => {
        Object.entries(PRESETS).forEach(([k, v]) => { d.addOption(k, v.name); });
        d.setValue(s.preset).onChange((v) => {
          this.plugin.applyPreset(v);
          void this.markDirty().then(() => { this.buildSettings(); });
        });
      })
      .addButton((b) =>
        b.setButtonText("Reset Preset")
         .setTooltip("Reset current preset to its default values")
         .onClick(() => {
           this.plugin.applyPreset(s.preset, true);
           void this.markDirty().then(() => { this.buildSettings(); });
         }),
      );

    // ── Page ──────────────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Page").setHeading();
    new Setting(containerEl).setName("Page size").addDropdown((d) => {
      Object.keys(PAGE_SIZES).forEach((k) => { d.addOption(k, k); });
      d.setValue(s.pageSize).onChange((v) => {
        s.pageSize = v;
        void this.markDirty();
      });
    });
    new Setting(containerEl).setName("Orientation").addDropdown((d) =>
      d.addOptions({ portrait: "Portrait", landscape: "Landscape" })
       .setValue(s.orientation)
       .onChange((v) => {
         s.orientation = v as "portrait" | "landscape";
         void this.markDirty();
       }),
    );

    // ── Margins ───────────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Margins (mm)").setHeading();
    type MarginKey = "marginTop" | "marginBottom" | "marginLeft" | "marginRight";
    const marginSetting = (name: string, key: MarginKey) =>
      new Setting(containerEl).setName(name).addText((t) =>
        t.setValue(String(s[key])).onChange((v) => {
          s[key] = parseInt(v) || 0;
          void this.markDirty();
        }),
      );
    marginSetting("Top",    "marginTop");
    marginSetting("Bottom", "marginBottom");
    marginSetting("Left",   "marginLeft");
    marginSetting("Right",  "marginRight");

    // ── Typography ────────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Typography").setHeading();
    let customFontSetting: Setting;
    new Setting(containerEl).setName("Font family").addDropdown((d) =>
      d.addOptions({
        "Georgia, serif":                          "Georgia (Serif)",
        "'Times New Roman', Times, serif":         "Times New Roman",
        "'Palatino Linotype', Palatino, serif":    "Palatino",
        "Arial, sans-serif":                       "Arial",
        "'Helvetica Neue', Helvetica, sans-serif": "Helvetica",
        "'Trebuchet MS', sans-serif":              "Trebuchet",
        "'Courier New', monospace":                "Courier New",
        "__custom__":                              "Custom…",
      }).setValue(s.fontFamily)
       .onChange((v) => {
         s.fontFamily = v;
         customFontSetting.settingEl.toggleClass("is-hidden", v !== "__custom__");
         void this.markDirty();
       }),
    );
    customFontSetting = new Setting(containerEl)
      .setName("Custom font name")
      .setDesc("CSS font-family value — e.g. \"Inter, sans-serif\". The font must be installed on your system.")
      .addText((t) =>
        t.setPlaceholder("e.g. Inter, sans-serif")
         .setValue(s.customFontName)
         .onChange((v) => { s.customFontName = v; void this.markDirty(); }),
      );
    customFontSetting.settingEl.toggleClass("is-hidden", s.fontFamily !== "__custom__");
    new Setting(containerEl).setName("Font size (px)").addDropdown((d) => {
      ["10","11","12","13","14","15","16"].forEach((v) => { d.addOption(v, v + "px"); });
      d.setValue(String(s.fontSize)).onChange((v) => {
        s.fontSize = parseInt(v);
        void this.markDirty();
      });
    });
    new Setting(containerEl).setName("Code font size").addDropdown((d) =>
      d.addOptions({ "0.75": "0.75em", "0.80": "0.80em", "0.82": "0.82em", "0.85": "0.85em", "0.88": "0.88em", "0.90": "0.90em", "1.0": "1.00em" })
       .setValue(String(s.codeFontSize))
       .onChange((v) => { s.codeFontSize = parseFloat(v); void this.markDirty(); }),
    );
    new Setting(containerEl)
      .setName("Code theme")
      .setDesc("Syntax highlighting theme for code blocks.")
      .addDropdown((d) => {
        Object.entries(HLJS_THEMES).forEach(([key, { label }]) => d.addOption(key, label));
        d.setValue(s.codeTheme)
         .onChange((v) => {
           s.codeTheme = v;
           // Sync the block background with the theme so they don't clash.
           const t = HLJS_THEMES[v];
           if (t) s.codeBackground = t.bg;
           // Rebuild the tab so the "Code background" colour picker reflects the sync.
           void this.markDirty().then(() => { this.buildSettings(); });
         });
      });
    new Setting(containerEl).setName("Line height").addDropdown((d) =>
      d.addOptions({ "1.4": "Tight (1.4)", "1.6": "Compact (1.6)", "1.75": "Normal (1.75)", "1.85": "Relaxed (1.85)", "2.0": "Double (2.0)" })
       .setValue(String(s.lineHeight))
       .onChange((v) => { s.lineHeight = parseFloat(v); void this.markDirty(); }),
    );
    new Setting(containerEl).setName("Paragraph spacing").addDropdown((d) =>
      d.addOptions({ "0": "None", "0.3": "Tight (0.3em)", "0.5": "Normal (0.5em)", "0.65": "Relaxed (0.65em)", "1.0": "Wide (1em)" })
       .setValue(String(s.paragraphSpacing))
       .onChange((v) => { s.paragraphSpacing = parseFloat(v); void this.markDirty(); }),
    );
    new Setting(containerEl)
      .setName("Heading scale")
      .setDesc("Multiplier applied to all heading sizes.")
      .addDropdown((d) =>
        d.addOptions({ "0.8": "Small (0.8×)", "0.88": "0.88×", "0.9": "Compact (0.9×)", "0.95": "0.95×", "1.0": "Normal (1.0×)", "1.05": "1.05×", "1.1": "Large (1.1×)", "1.2": "XLarge (1.2×)" })
         .setValue(String(s.headingScale))
         .onChange((v) => { s.headingScale = parseFloat(v); void this.markDirty(); }),
      );

    // ── Colors ────────────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Colors").setHeading();
    type ColorKey = "accentColor" | "bodyColor" | "headingColor" | "pageBackground"
      | "blockquoteBg" | "blockquoteBorderColor" | "tableHeaderBg" | "codeBackground";
    const colorSetting = (name: string, key: ColorKey) =>
      new Setting(containerEl).setName(name).addColorPicker((cp) =>
        cp.setValue(s[key]).onChange((v) => {
          s[key] = v;
          void this.markDirty();
        }),
      );
    colorSetting("Accent color",            "accentColor");
    colorSetting("Body text color",         "bodyColor");
    colorSetting("Heading color",           "headingColor");
    colorSetting("Page background",         "pageBackground");
    colorSetting("Blockquote background",   "blockquoteBg");
    colorSetting("Blockquote border",       "blockquoteBorderColor");
    colorSetting("Table header background", "tableHeaderBg");
    colorSetting("Code background",         "codeBackground");

    // ── Heading style ─────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Heading Style").setHeading();
    new Setting(containerEl).setName("H1 bottom border").addToggle((t) =>
      t.setValue(s.h1BorderBottom).onChange((v) => { s.h1BorderBottom = v; void this.markDirty(); }),
    );
    new Setting(containerEl).setName("H2 bottom border").addToggle((t) =>
      t.setValue(s.h2BorderBottom).onChange((v) => { s.h2BorderBottom = v; void this.markDirty(); }),
    );
    new Setting(containerEl).setName("Center H1").addToggle((t) =>
      t.setValue(s.centerH1).onChange((v) => { s.centerH1 = v; void this.markDirty(); }),
    );

    // ── Tables ────────────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Tables").setHeading();
    new Setting(containerEl).setName("Striped rows").addToggle((t) =>
      t.setValue(s.tableStriped).onChange((v) => { s.tableStriped = v; void this.markDirty(); }),
    );

    // ── Header & Footer ───────────────────────────────────────────────────────
    new Setting(containerEl).setName("Header & Footer").setHeading();
    new Setting(containerEl).setName("Show header").addToggle((t) =>
      t.setValue(s.showHeader).onChange((v) => { s.showHeader = v; void this.markDirty(); }),
    );
    new Setting(containerEl)
      .setName("Header text")
      .setDesc("Appears on every page according to the chosen alignment.")
      .addText((t) => t.setValue(s.headerText).onChange((v) => { s.headerText = v; void this.markDirty(); }));
    new Setting(containerEl).setName("Header alignment").addDropdown((d) =>
      d.addOptions({ left: "Left", center: "Center", right: "Right" })
       .setValue(s.headerAlignment)
       .onChange((v) => { s.headerAlignment = v as "left"|"center"|"right"; void this.markDirty(); }),
    );
    new Setting(containerEl).setName("Show footer").addToggle((t) =>
      t.setValue(s.showFooter).onChange((v) => { s.showFooter = v; void this.markDirty(); }),
    );
    new Setting(containerEl).setName("Footer border").setDesc("Show the separator line above the footer.").addToggle((t) =>
      t.setValue(s.showFooterBorder).onChange((v) => { s.showFooterBorder = v; void this.markDirty(); }),
    );
    new Setting(containerEl)
      .setName("Footer text")
      .addText((t) => t.setValue(s.footerText).onChange((v) => { s.footerText = v; void this.markDirty(); }));
    new Setting(containerEl).setName("Show page numbers").addToggle((t) =>
      t.setValue(s.showPageNumbers).onChange((v) => { s.showPageNumbers = v; void this.markDirty(); }),
    );
    new Setting(containerEl).setName("Page number position").addDropdown((d) =>
      d.addOptions({ left: "Left", center: "Center", right: "Right" })
       .setValue(s.pageNumberPosition)
       .onChange((v) => { s.pageNumberPosition = v as "left"|"center"|"right"; void this.markDirty(); }),
    );
    new Setting(containerEl)
      .setName("Page number start")
      .setDesc("Number assigned to the first visible page number. Accepts any integer.")
      .addText((t) =>
        t.setValue(String(s.pageNumberStart))
         .onChange((v) => {
           const n = parseInt(v, 10);
           s.pageNumberStart = isNaN(n) ? 1 : n;
           void this.markDirty();
         }),
      );
    new Setting(containerEl)
      .setName("Header/footer on first page")
      .setDesc("When off, page 1 has no header, footer, or page number. Numbering begins on page 2 using the start value.")
      .addToggle((t) =>
        t.setValue(s.showHeaderFooterOnFirstPage).onChange((v) => {
          s.showHeaderFooterOnFirstPage = v;
          void this.markDirty();
        }),
      );

    // ── Behaviour ─────────────────────────────────────────────────────────────
    new Setting(containerEl).setName("Behaviour").setHeading();
    new Setting(containerEl)
      .setName("Hide frontmatter")
      .setDesc("Strip the YAML frontmatter block (--- … ---) from the preview and exported PDF.")
      .addToggle((t) =>
        t.setValue(s.hideFrontmatter).onChange((v) => {
          s.hideFrontmatter = v;
          void this.markDirty();
        }),
      );
    new Setting(containerEl)
      .setName("Include file name as title")
      .setDesc(
        "Prepend the note's file name as an H1 heading at the top of the PDF. " +
        "Mirrors Obsidian's built-in 'Include file name as title' export option.",
      )
      .addToggle((t) =>
        t.setValue(s.includeFilenameAsTitle).onChange((v) => {
          s.includeFilenameAsTitle = v;
          void this.markDirty();
        }),
      );
    new Setting(containerEl).setName("Auto page break before H1").addToggle((t) =>
      t.setValue(s.autoBreakH1).onChange((v) => { s.autoBreakH1 = v; void this.markDirty(); }),
    );
    new Setting(containerEl).setName("Auto page break before H2").addToggle((t) =>
      t.setValue(s.autoBreakH2).onChange((v) => { s.autoBreakH2 = v; void this.markDirty(); }),
    );
  }
}
