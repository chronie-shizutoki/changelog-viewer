import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Specify the entry file
  build: {
    // Ensure the output directory is dist
    outDir: 'dist',
    // Ensure static asset paths are correct
    assetsDir: 'assets',
    // Keep CSS code splitting as Vite handles it by default
    cssCodeSplit: true,
    // Ensure the generated HTML file correctly references resources
    rollupOptions: {
      // Explicitly specify the entry file
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // Use relative paths to ensure resources load correctly
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Ensure relative paths are used
        manualChunks: undefined,
      },
    },
  },
})
