import { useState, useEffect } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { marked } from 'marked'
import './App.css'

// Language configurations
const languages = {
  en: { name: 'English' },
  ja: { name: '日本語' },
  zh: { name: '简体中文' },
  tw: { name: '繁體中文' }
}

const uiTexts = {
  "en": {
    "title": 'New Stuff! 🎉',
    "subtitle": 'See all the cool things we added for u!',
    "loading": 'Loading happi updates... 🐾',
    "error": 'Oops! Cant load the news 😿',
    "version": 'Versin',
    "darkMode": 'Dark mode go nyoom 🌙',
    "language": 'Speak my language! 🌍'
  },
  "ja": {
    "title": 'お知らせにゃん！🎉',
    "subtitle": '新しい機能と改善点をご紹介しますにゃ',
    "loading": '更新をチェック中... 🐾',
    "error": 'お知らせの読み込みに失敗しました 😿',
    "version": 'バージョン',
    "darkMode": 'ダークモードで遊ぼう 🌙',
    "language": '言葉を変える 🌍'
  },
  "zh": {
    "title": '新鲜事速递！🎉',
    "subtitle": '来看看我们又准备了什么小惊喜~',
    "loading": '正在检查新礼物... 🐾',
    "error": '哎呀，消息迷路了 😿',
    "version": '版本',
    "darkMode": '夜间模式开关 🌙', 
    "language": '切换语言 🌍'
  },
  "tw": {
    "title": '新鮮事速遞！🎉',
    "subtitle": '來看看我們又準備了什麼小驚喜~',
    "loading": '正在檢查新禮物... 🐾',
    "error": '哎呀，訊息迷路了 😿',
    "version": '版本',
    "darkMode": '夜間模式開關 🌙',
    "language": '切換語言 🌍'
  }
}

function App() {
  // Initialize dark mode: Check session storage and browser preferences
  const getInitialDarkMode = () => {
    // First check if there is a user preference in session storage
    const storedDarkMode = sessionStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      return storedDarkMode === 'true';
    }
    // Otherwise check browser preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Initialize language: Check browser language settings
  const getInitialLanguage = () => {
    // Get browser preferred language
    const browserLang = navigator.language.split('-')[0]; // Get main language code (e.g. 'en-US' -> 'en')
    // Check if the language is supported
    if (Object.keys(languages).includes(browserLang)) {
      return browserLang;
    }
    // If not supported, use default language
    return 'en';
  };

  const [darkMode, setDarkMode] = useState(getInitialDarkMode)
  const [language, setLanguage] = useState(getInitialLanguage)
  const [changelogs, setChangelogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [dropdownState, setDropdownState] = useState('closed') // 'open', 'closing', 'closed'

  const text = uiTexts[language]

  // Handle dropdown animation states
  const handleMenuToggle = () => {
    if (dropdownState === 'open' || dropdownState === 'closing') {
      setDropdownState('closing')
      // Wait for close animation to complete before hiding
      setTimeout(() => {
        setShowLangMenu(false)
        setDropdownState('closed')
      }, 400)
    } else {
      setShowLangMenu(true)
      setDropdownState('open')
    }
  }

  // Handle language selection
  const handleLanguageSelect = (key) => {
    setLanguage(key)
    setDropdownState('closing')
    setTimeout(() => {
      setShowLangMenu(false)
      setDropdownState('closed')
    }, 400)
  }

  // Load changelogs from JSON file
  useEffect(() => {
    const loadChangelogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`changelogs/${language}.json`)
        if (!response.ok) {
          throw new Error('Failed to fetch changelogs')
        }
        const data = await response.json()
        setChangelogs(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadChangelogs()
  }, [language])

  // Toggle dark mode and save to session storage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save dark mode preference to session storage
    sessionStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode])

  return (
    <div className="min-h-screen gradient-bg">
      <div className="min-h-screen backdrop-blur-sm">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{text.title}</h1>
              <p className="text-sm text-foreground/70">{text.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMenuToggle}
                  className="glass hover:bg-white/20"
                  title={text.language}
                >
                  <Globe className="h-5 w-5" />
                </Button>
                
                {(showLangMenu || dropdownState === 'closing') && (
                  <div className={`absolute right-0 mt-2 glass rounded-lg overflow-hidden shadow-lg w-28 lang-dropdown-transition ${
                    dropdownState === 'open' ? 'lang-dropdown-open' : 'lang-dropdown-closed'
                  }`}>
                    {Object.entries(languages).map(([key, lang]) => (
                      <button
                        key={key}
                        onClick={() => handleLanguageSelect(key)}
                        className={`block w-full px-4 py-2 text-left hover:bg-white/20 lang-dropdown-item ${
                          language === key ? 'bg-white/10' : ''
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
                </div>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="glass hover:bg-white/20"
                title={text.darkMode}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-foreground/20 border-t-foreground"></div>
              <p className="mt-4 text-foreground/70">{text.loading}</p>
            </div>
          )}

          {error && (
            <div className="glass-card text-center py-12">
              <p className="text-destructive text-lg">{text.error}</p>
              <p className="text-foreground/70 mt-2">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {changelogs.map((log, index) => (
                <article
                  key={index}
                  className="glass-card"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                        {text.version} {log.version}
                      </span>
                      <span className="text-foreground/60 text-sm">{log.date}</span>
                    </div>
                  </div>
                  
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{
                      __html: marked(log.content)
                    }}
                  />
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="glass border-t border-white/10 mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-foreground/60 text-sm">
            <p>Changelog Viewer • 2025</p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default App
