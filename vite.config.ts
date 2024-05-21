import { defineConfig } from "vite"

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      root: ".",
      assetsInclude: ["index.css"],
    }
  }
  // command === 'build'
  return {
    root: ".",
    assetsInclude: ["index.css"],
    base: "/",
  }
})
