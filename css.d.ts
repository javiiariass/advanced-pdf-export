// CSS files are imported as raw strings via esbuild's text loader
// (see esbuild.config.mjs). This tells TypeScript the import shape.
declare module "*.css" {
  const content: string;
  export default content;
}
