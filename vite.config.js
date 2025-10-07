import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// GitHub Pages部署配置
// 仓库名称应该与GitHub上的仓库名称完全一致
const REPO_NAME = 'changelog-viewer'

// https://vite.dev/config/
export default defineConfig({
  // 为GitHub Pages设置base路径
  // 确保这个路径与GitHub Pages的URL结构完全匹配
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 指定入口文件
  build: {
    // 确保输出目录为dist
    outDir: 'dist',
    // 确保静态资源文件路径正确
    assetsDir: 'assets',
    // 保持CSS代码拆分，让Vite默认处理
    cssCodeSplit: true,
    // 确保生成的HTML文件正确引用资源
    rollupOptions: {
      // 明确指定入口文件
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // 使用相对路径确保资源正确加载
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // 确保使用相对路径
        manualChunks: undefined,
      },
    },
  },
})
