import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "html2canvas"],
  // esbuild only preserves a directive prologue ("use client") if it's the first
  // statement of the final bundle; per-file "use client" markers on the individual
  // source modules get dropped once everything is bundled into one dist file. The
  // whole package is client-only, so re-add it at the top of both outputs here.
  banner: {
    js: '"use client";',
  },
});
