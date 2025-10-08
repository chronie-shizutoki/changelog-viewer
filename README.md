# Changelog Viewer - Glassmorphism Changelog Display Page

A modern changelog display webpage featuring a Glassmorphism design style, with support for multi-language switching and dark mode.

## Key Features

### 🎨 Glassmorphism Design
- Modern design style with frosted glass effects
- Semi-transparent backgrounds combined with blur effects
- Dynamic gradient background animations
- Smooth transition effects on hover

### 🌍 Multi-Language Support
- Supports three languages: English, Chinese, and Japanese
- Easily extendable to more languages
- Both interface text and log content support multiple languages
- Language switching takes effect in real-time

### 🌓 Dark Mode
- Full dark/light theme support
- Smooth theme switching transition animations
- Automatically adapted color schemes
- Glassmorphism effects are perfectly presented in both modes

### 📝 Markdown Support
- Log content supports full Markdown formatting
- Supports common syntax like headers, lists, bold, links, etc.
- Code blocks and inline code highlighting
- Automatically rendered into beautiful HTML

### 📦 External File Loading
- Log content loaded from separate JSON files
- Easy to maintain and update
- Supports version numbers, dates, and content
- Update logs without modifying code

## Project Structure

```
changelog-viewer/
├── public/
│   └── changelogs/          # Log files directory
│       ├── en.json          # English logs
│       ├── ...              # Other language logs
├── src/
│   ├── components/          # React components
│   ├── App.jsx             # Main application component
│   ├── App.css             # Stylesheet
│   └── main.jsx            # Entry file
├── index.html              # HTML template
└── package.json            # Project configuration
```

## Log File Format

Log files use JSON format and are located in the `public/changelogs/` directory. Each language corresponds to one file:

```json
[
  {
    "version": "2.1.0",
    "date": "2024-03-15",
    "content": "## New Features\n\n- Added **Dark Mode** support\n- Implemented **Glassmorphism** design\n\n## Improvements\n\n- Optimized performance"
  }
]
```

### Field Description
- `version`: Version number (string)
- `date`: Release date (YYYY-MM-DD format)
- `content`: Log content (supports Markdown format, use `\n` for line breaks)

## How to Add a New Language

1. Create a new language file in the `public/changelogs/` directory, e.g., `fr.json`
2. Add language configuration in `App.jsx`:

```javascript
const languages = {
  en: { name: 'English' },
  ...
  fr: { name: 'Français' }  // New addition
}
```

3. Add corresponding interface text translations:

```javascript
const uiTexts = {
  // ... Other languages
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

## Tech Stack

- **React 19** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling framework
- **marked** - Markdown parsing library
- **Lucide React** - Icon library

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Style Customization

### Modify Gradient Background

Find the `.gradient-bg` class in `App.css` and modify the gradient colors:

```css
.gradient-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
```

### Adjust Glass Effect

Modify the properties of the `.glass` class:

```css
.glass {
  background: rgba(255, 255, 255, 0.1);  /* Background transparency */
  backdrop-filter: blur(20px);            /* Blur intensity */
  border: 1px solid rgba(255, 255, 255, 0.2);  /* Border transparency */
}
```

### Custom Color Scheme

Modify CSS variables in the `:root` and `.dark` selectors in `App.css`:

```css
:root {
  --primary: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  /* ... Other color variables */
}
```

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 103+
- Safari 15.4+

**Note**: The Glassmorphism effect requires browser support for the `backdrop-filter` property.