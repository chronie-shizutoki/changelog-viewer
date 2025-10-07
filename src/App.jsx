import { useState, useEffect } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { marked } from 'marked'
import './App.css'

// Language configurations
const languages = {
  en: { name: 'English' },
  zh: { name: '中文' },
  ja: { name: '日本語' }
}

const uiTexts = {
  en: {
    title: 'Changelog',
    subtitle: 'Track all updates and improvements',
    loading: 'Loading changelogs...',
    error: 'Failed to load changelogs',
    version: 'Version',
    darkMode: 'Toggle dark mode',
    language: 'Change language'
  },
  zh: {
    title: '更新日志',
    subtitle: '追踪所有更新和改进',
    loading: '加载日志中...',
    error: '加载日志失败',
    version: '版本',
    darkMode: '切换深色模式',
    language: '切换语言'
  },
  ja: {
    title: '更新履歴',
    subtitle: 'すべての更新と改善を追跡',
    loading: '履歴を読み込み中...',
    error: '履歴の読み込みに失敗しました',
    version: 'バージョン',
    darkMode: 'ダークモード切替',
    language: '言語を変更'
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const [changelogs, setChangelogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const text = uiTexts[language]

  // Load changelogs from JSON file
  useEffect(() => {
    const loadChangelogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/changelogs/${language}.json`)
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

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Cycle through languages
  const cycleLanguage = () => {
    const langKeys = Object.keys(languages)
    const currentIndex = langKeys.indexOf(language)
    const nextIndex = (currentIndex + 1) % langKeys.length
    setLanguage(langKeys[nextIndex])
    setShowLangMenu(false)
  }

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
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="glass hover:bg-white/20"
                  title={text.language}
                >
                  <Globe className="h-5 w-5" />
                </Button>
                
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 glass rounded-lg overflow-hidden shadow-lg">
                    {Object.entries(languages).map(([key, lang]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setLanguage(key)
                          setShowLangMenu(false)
                        }}
                        className={`block w-full px-4 py-2 text-left hover:bg-white/20 transition-colors ${
                          language === key ? 'bg-white/10' : ''
                        }`}
                      >
                        <span className="mr-2">{lang.flag}</span>
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
            <p>Glassmorphism Changelog Viewer • Built with React</p>
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
