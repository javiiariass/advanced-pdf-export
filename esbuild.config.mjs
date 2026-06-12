import esbuild from "esbuild";
import { builtinModules } from "module";

const isProduction = process.argv.includes("production");

const external = [
  "obsidian",
  "electron",
  "codemirror",
  "@codemirror/state",
  "@codemirror/view",
  "@codemirror/commands",
  "@codemirror/language",
  "@codemirror/search",
  "@codemirror/autocomplete",
  "@lezer/common",
  "@lezer/lr",
  ...builtinModules,
];

const ctx = await esbuild.context({
  entryPoints: ["main.ts"],
  bundle: true,
  outfile: "main.js",
  external,
  format: "cjs",
  target: "es2022",
  platform: "browser",
  sourcemap: isProduction ? false : "inline",
  minify: isProduction,
  logLevel: "info",
  // highlight.js theme stylesheets are imported as raw strings (see hljs-themes.ts).
  loader: { ".css": "text" },
});

if (isProduction) {
  await ctx.rebuild();
  await ctx.dispose();
} else {
  await ctx.watch();
  console.log("Watching for changes...");
}
