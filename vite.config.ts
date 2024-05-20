import { defineConfig } from "vite"

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === "serve") {
    return {
      root: "./",
      assetsInclude: ["index.css"],
    }
  }
  // command === 'build'
  return {
    root: "./",
    assetsInclude: ["index.css"],
    // build specific config
  }
})
