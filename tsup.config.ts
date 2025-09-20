import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/nodes/**/*.ts",
    "src/lib/*.ts",
    // Exclude test files from compilation
    "!src/**/*.test.ts"
  ],
  outDir: "lib",
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: true,
  bundle: false,
  keepNames: true,
  tsconfig: "./ts.config.json",
});
