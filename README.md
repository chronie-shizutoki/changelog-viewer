# Changelog Viewer - 液态玻璃样式更新日志展示网页

一个现代化的更新日志展示网页，采用液态玻璃（Glassmorphism）设计风格，支持多语言切换和深色模式。

## 主要特性

### 🎨 液态玻璃设计
- 采用磨砂玻璃效果的现代设计风格
- 半透明背景配合模糊效果
- 动态渐变背景动画
- 悬停时的平滑过渡效果

### 🌍 多语言支持
- 支持英文、中文、日文三种语言
- 可轻松扩展更多语言
- 界面文本和日志内容均支持多语言
- 语言切换实时生效

### 🌓 深色模式
- 完整的深色/浅色主题支持
- 平滑的主题切换过渡动画
- 自动适配的颜色方案
- 液态玻璃效果在两种模式下均完美呈现

### 📝 Markdown 支持
- 日志内容支持完整的 Markdown 格式
- 支持标题、列表、粗体、链接等常用语法
- 代码块和内联代码高亮显示
- 自动渲染为美观的 HTML

### 📦 外部文件加载
- 日志内容从独立的 JSON 文件加载
- 易于维护和更新
- 支持版本号、日期和内容
- 无需修改代码即可更新日志

## 项目结构

```
changelog-viewer/
├── public/
│   └── changelogs/          # 日志文件目录
│       ├── en.json          # 英文日志
│       ├── zh.json          # 中文日志
│       └── ja.json          # 日文日志
├── src/
│   ├── components/          # React 组件
│   ├── App.jsx             # 主应用组件
│   ├── App.css             # 样式文件
│   └── main.jsx            # 入口文件
├── index.html              # HTML 模板
└── package.json            # 项目配置
```

## 日志文件格式

日志文件采用 JSON 格式，位于 `public/changelogs/` 目录下。每种语言对应一个文件：

```json
[
  {
    "version": "2.1.0",
    "date": "2024-03-15",
    "content": "## 新功能\n\n- 添加了**深色模式**支持\n- 实现了**液态玻璃**设计\n\n## 改进\n\n- 优化了性能"
  }
]
```

### 字段说明
- `version`: 版本号（字符串）
- `date`: 发布日期（YYYY-MM-DD 格式）
- `content`: 日志内容（支持 Markdown 格式，使用 `\n` 表示换行）

## 如何添加新语言

1. 在 `public/changelogs/` 目录下创建新的语言文件，如 `fr.json`
2. 在 `App.jsx` 中添加语言配置：

```javascript
const languages = {
  en: { name: 'English' },
  zh: { name: '中文' },
  ja: { name: '日本語' },
  fr: { name: 'Français' }  // 新增
}
```

3. 添加对应的界面文本翻译：

```javascript
const uiTexts = {
  // ... 其他语言
  fr: {
    title: 'Journal des modifications',
    subtitle: 'Suivez toutes les mises à jour',
    loading: 'Chargement...',
    error: 'Échec du chargement',
    version: 'Version',
    darkMode: 'Basculer le mode sombre',
    language: 'Changer de langue'
  }
}
```

## 技术栈

- **React 19** - 前端框架
- **Vite** - 构建工具
- **Tailwind CSS 4** - 样式框架
- **marked** - Markdown 解析库
- **Lucide React** - 图标库

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览生产版本
pnpm run preview
```

## 样式定制

### 修改渐变背景

在 `App.css` 中找到 `.gradient-bg` 类，修改渐变颜色：

```css
.gradient-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
```

### 调整玻璃效果

修改 `.glass` 类的属性：

```css
.glass {
  background: rgba(255, 255, 255, 0.1);  /* 背景透明度 */
  backdrop-filter: blur(20px);            /* 模糊程度 */
  border: 1px solid rgba(255, 255, 255, 0.2);  /* 边框透明度 */
}
```

### 自定义颜色方案

在 `App.css` 的 `:root` 和 `.dark` 选择器中修改 CSS 变量：

```css
:root {
  --primary: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  /* ... 其他颜色变量 */
}
```

## 浏览器兼容性

- Chrome/Edge 88+
- Firefox 103+
- Safari 15.4+

**注意**: 液态玻璃效果需要浏览器支持 `backdrop-filter` 属性。