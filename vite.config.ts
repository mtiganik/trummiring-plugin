import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) =>({
    base: mode === 'production'
    ? '/wp-content/plugins/trummiring-plugin/dist'
    : '/',

  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      // external: ["react", "react-dom"],
      output: {
        format: "iife",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: `assets/index.js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
}));
