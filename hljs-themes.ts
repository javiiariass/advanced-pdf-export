// Curated highlight.js theme bundle.
//
// Theme stylesheets are imported as raw strings via esbuild's text loader
// (configured in esbuild.config.mjs as `loader: { ".css": "text" }`). We import
// only the handful of themes we offer instead of all ~190 that ship with hljs.
//
// The `bg` field mirrors each theme's own `.hljs` background colour so the
// settings UI can sync `codeBackground` when the user picks a theme.

import githubCSS from "highlight.js/styles/github.css";
import githubDarkCSS from "highlight.js/styles/github-dark.css";
import atomOneDarkCSS from "highlight.js/styles/atom-one-dark.css";
import atomOneLightCSS from "highlight.js/styles/atom-one-light.css";
import tokyoNightDarkCSS from "highlight.js/styles/tokyo-night-dark.css";
import tokyoNightLightCSS from "highlight.js/styles/tokyo-night-light.css";
import monokaiCSS from "highlight.js/styles/monokai.css";
import nordCSS from "highlight.js/styles/nord.css";
// Catppuccin is not part of highlight.js core — vendored locally.
import catppuccinMacchiatoCSS from "./themes/catppuccin-macchiato.css";

export interface HljsTheme {
  label: string;
  css: string;
  bg: string;
}

export const HLJS_THEMES: Record<string, HljsTheme> = {
  "github":            { label: "GitHub",            css: githubCSS,          bg: "#f3f4f6" },
  "github-dark":       { label: "GitHub Dark",       css: githubDarkCSS,      bg: "#0d1117" },
  "atom-one-light":    { label: "Atom One Light",    css: atomOneLightCSS,    bg: "#fafafa" },
  "atom-one-dark":     { label: "Atom One Dark",     css: atomOneDarkCSS,     bg: "#282c34" },
  "tokyo-night-light": { label: "Tokyo Night Light", css: tokyoNightLightCSS, bg: "#d5d6db" },
  "tokyo-night-dark":  { label: "Tokyo Night",       css: tokyoNightDarkCSS,  bg: "#1a1b26" },
  "monokai":           { label: "Monokai",           css: monokaiCSS,         bg: "#272822" },
  "nord":              { label: "Nord",              css: nordCSS,            bg: "#2e3440" },
  "catppuccin-macchiato": { label: "Catppuccin Macchiato", css: catppuccinMacchiatoCSS, bg: "#24273a" },
};
