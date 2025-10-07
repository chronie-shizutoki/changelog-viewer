import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// 获取仓库名称用于GitHub Pages的base路径
// 这会从package.json中的name字段获取
const pkg = require('./package.json')
const REPO_NAME = pkg.name

// https://vite.dev/config/
export default defineConfig({
  // 为GitHub Pages设置base路径
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
