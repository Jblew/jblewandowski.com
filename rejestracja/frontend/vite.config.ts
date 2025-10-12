import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].[hash].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'index.css';
          }
          return `[name].[hash][extname]`;
        },
      },
    },
  },
});
