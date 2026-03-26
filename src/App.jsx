import { useState, useEffect } from 'react'
import { Moon, Sun, Monitor, Globe } from 'lucide-react'
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
    "title": '🎉New Stuff!',
    "subtitle": 'See all the cool things we added for u!',
    "loading": 'Loading happi updates... 🐾',
    "error": 'Oops! Cant load the news 😿',
    "themeSystem": 'System',
    "themeLight": 'Light',
    "themeDark": 'Dark',
    "language": 'Speak my language! 🌍',
    "timeToday": 'Today',
    "timeYesterday": 'Yesterday',
    "timeDaysAgo": '{days}d ago',
    "timeWeeksAgo": '{weeks}w ago',
    "timeMonthsAgo": '{months}mo ago',
    "timeYearsAgo": '{years}y ago'
  },
  "ja": {
    "title": '🎉お知らせにゃん！',
    "subtitle": '新しい機能と改善点をご紹介しますにゃ',
    "loading": '更新をチェック中... 🐾',
    "error": 'お知らせの読み込みに失敗しました 😿',
    "themeSystem": '自動',
    "themeLight": 'ライト',
    "themeDark": 'ダーク',
    "language": '言葉を変える 🌍',
    "timeToday": '今日',
    "timeYesterday": '昨日',
    "timeDaysAgo": '{days}日前',
    "timeWeeksAgo": '{weeks}週間前',
    "timeMonthsAgo": '{months}か月前',
    "timeYearsAgo": '{years}年前'
  },
  "zh": {
    "title": '🎉新鲜事速递！',
    "subtitle": '来看看我们又准备了什么小惊喜~',
    "loading": '正在检查新礼物... 🐾',
    "error": '哎呀，消息迷路了 😿',
    "themeSystem": '系统', 
    "themeLight": '浅色',
    "themeDark": '深色',
    "language": '切换语言 🌍',
    "timeToday": '今天',
    "timeYesterday": '昨天',
    "timeDaysAgo": '{days}天前',
    "timeWeeksAgo": '{weeks}周前',
    "timeMonthsAgo": '{months}月前',
    "timeYearsAgo": '{years}年前'
  },
  "tw": {
    "title": '🎉新鮮事速遞！',
    "subtitle": '來看看我們又準備了什麼小驚喜~',
    "loading": '正在檢查新禮物... 🐾',
    "error": '哎呀，訊息迷路了 😿',
    "themeSystem": '系統',
    "themeLight": '淺色',
    "themeDark": '深色',
    "language": '切換語言 🌍',
    "timeToday": '今天',
    "timeYesterday": '昨天',
    "timeDaysAgo": '{days}天前',
    "timeWeeksAgo": '{weeks}週前',
    "timeMonthsAgo": '{months}月前',
    "timeYearsAgo": '{years}年前'
  }
}

function App() {
  const getInitialThemeMode = () => {
    const storedThemeMode = sessionStorage.getItem('themeMode');
    if (storedThemeMode !== null) {
      return storedThemeMode;
    }
    return 'system';
  };

  const getInitialLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(languages).includes(browserLang)) {
      return browserLang;
    }
    return 'en';
  };

  const [themeMode, setThemeMode] = useState(getInitialThemeMode)
  const [language, setLanguage] = useState(getInitialLanguage)
  const [changelogs, setChangelogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [dropdownState, setDropdownState] = useState('closed')
  const [themeDropdownState, setThemeDropdownState] = useState('closed')
  const [themeTransition, setThemeTransition] = useState({ isActive: false, mode: null })

  const text = uiTexts[language]

  const themeOptions = [
    { key: 'system', label: text.themeSystem, icon: Monitor },
    { key: 'light', label: text.themeLight, icon: Sun },
    { key: 'dark', label: text.themeDark, icon: Moon }
  ]

  const getCurrentThemeIcon = () => {
    switch (themeMode) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Monitor;
    }
  }

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return text.timeToday;
    } else if (diffDays === 1) {
      return text.timeYesterday;
    } else if (diffDays >= 2 && diffDays <= 6) {
      return text.timeDaysAgo.replace('{days}', diffDays);
    } else if (diffDays >= 7 && diffDays <= 27) {
      const weeks = Math.floor(diffDays / 7);
      return text.timeWeeksAgo.replace('{weeks}', weeks);
    }

    const yearDiff = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;

    const targetDay = date.getDate();
    const currentDay = now.getDate();

    let months = totalMonths;
    if (currentDay < targetDay) {
      const dayDifference = targetDay - currentDay;
      if (dayDifference > 5) {
        months = totalMonths - 1;
      }
    }

    if (months < 1) {
      const weeks = Math.floor(diffDays / 7);
      return text.timeWeeksAgo.replace('{weeks}', weeks);
    } else if (months < 12) {
      return text.timeMonthsAgo.replace('{months}', months);
    } else {
      const years = Math.floor(months / 12);
      return text.timeYearsAgo.replace('{years}', years);
    }
  }

  const handleMenuToggle = () => {
    if (dropdownState === 'open' || dropdownState === 'closing') {
      setDropdownState('closing')
      setTimeout(() => {
        setShowLangMenu(false)
        setDropdownState('closed')
      }, 400)
    } else {
      setShowLangMenu(true)
      setDropdownState('open')
    }
  }

  const handleThemeMenuToggle = () => {
    if (themeDropdownState === 'open' || themeDropdownState === 'closing') {
      setThemeDropdownState('closing')
      setTimeout(() => {
        setShowThemeMenu(false)
        setThemeDropdownState('closed')
      }, 400)
    } else {
      setShowThemeMenu(true)
      setThemeDropdownState('open')
    }
  }

  const handleLanguageSelect = (key) => {
    setLanguage(key)
    setDropdownState('closing')
    setTimeout(() => {
      setShowLangMenu(false)
      setDropdownState('closed')
    }, 400)
  }

  const handleThemeSelect = (key) => {
    if (key === themeMode) {
      setTimeout(() => {
        setThemeDropdownState('closing')
        setTimeout(() => {
          setShowThemeMenu(false)
          setThemeDropdownState('closed')
        }, 400)
      }, 50)
      return
    }

    const getCurrentActualTheme = () => {
      if (themeMode === 'dark') return 'dark';
      if (themeMode === 'light') return 'light';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const getNewActualTheme = () => {
      if (key === 'dark') return 'dark';
      if (key === 'light') return 'light';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const currentActualTheme = getCurrentActualTheme();
    const newActualTheme = getNewActualTheme();

    if (currentActualTheme !== newActualTheme) {
      setThemeTransition({ isActive: true, mode: key })

      setTimeout(() => {
        setThemeMode(key)
      }, 400)

      setTimeout(() => {
        setThemeTransition({ isActive: false, mode: null })
      }, 800)
    } else {
      setThemeMode(key)
    }

    setTimeout(() => {
      setThemeDropdownState('closing')
      setTimeout(() => {
        setShowThemeMenu(false)
        setThemeDropdownState('closed')
      }, 400)
    }, 50)
  }

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

  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    };

    applyTheme();
    sessionStorage.setItem('themeMode', themeMode);

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLangMenu || dropdownState === 'closing') {
        const langButton = event.target.closest('button[title="' + text.language + '"]');
        const langDropdown = event.target.closest('.lang-dropdown-transition');
        
        if (!langButton && !langDropdown) {
          setDropdownState('closing');
          setTimeout(() => {
            setShowLangMenu(false);
            setDropdownState('closed');
          }, 400);
        }
      }

      if (showThemeMenu || themeDropdownState === 'closing') {
        const themeButton = event.target.closest('.theme-toggle-btn');
        const themeDropdown = event.target.closest('.lang-dropdown-transition');
        
        if (!themeButton && !themeDropdown) {
          setThemeDropdownState('closing');
          setTimeout(() => {
            setShowThemeMenu(false);
            setThemeDropdownState('closed');
          }, 400);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangMenu, dropdownState, showThemeMenu, themeDropdownState, text.language])

  return (
    <div className="min-h-screen gradient-bg">
      <div className="min-h-screen backdrop-blur-sm">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-white/10">
          <div className="container mx-auto px-4 py-2 flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
              <p className="text-sm text-foreground/70">{text.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2 absolute right-4">
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

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleThemeMenuToggle}
                  className="glass hover:bg-white/20 theme-toggle-btn"
                  title={themeOptions.find(opt => opt.key === themeMode)?.label}
                >
                  {(() => {
                    const Icon = getCurrentThemeIcon();
                    return <Icon className="h-5 w-5" />;
                  })()}
                </Button>
                
                {(showThemeMenu || themeDropdownState === 'closing') && (
                  <div className={`absolute right-0 mt-2 glass rounded-lg overflow-hidden shadow-lg w-28 lang-dropdown-transition ${
                    themeDropdownState === 'open' ? 'lang-dropdown-open' : 'lang-dropdown-closed'
                  }`}>
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.key}
                          onClick={() => handleThemeSelect(option.key)}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-white/20 lang-dropdown-item ${
                            themeMode === option.key ? 'bg-white/10' : ''
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
                        {log.version}
                      </span>
                    </div>
                    <span className="text-foreground/60 text-sm">{formatRelativeTime(log.date)}</span>
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
      </div>

      {/* Theme transition overlay */}
      {themeTransition.isActive && (
        <div 
          className={`fixed inset-0 z-[9999] pointer-events-none theme-transition-overlay ${
            themeTransition.mode === 'dark' ? 'theme-to-dark' : 'theme-to-light'
          }`}
        />
      )}

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

        .theme-transition-overlay {
          background: #000;
          opacity: 0;
          clip-path: circle(0% at calc(100% - 3rem) 2rem);
          transition: clip-path 0.4s ease-in-out, opacity 0.4s ease-in-out;
        }

        .theme-transition-overlay.theme-to-dark {
          animation: themeExpand 0.8s ease-in-out forwards;
        }

        .theme-transition-overlay.theme-to-light {
          animation: themeExpand 0.8s ease-in-out forwards;
        }

        @keyframes themeExpand {
          0% {
            clip-path: circle(0% at calc(100% - 3rem) 2rem);
            opacity: 0;
          }
          30% {
            clip-path: circle(10% at calc(100% - 3rem) 2rem);
            opacity: 0.8;
          }
          50% {
            clip-path: circle(150% at calc(100% - 3rem) 2rem);
            opacity: 1;
          }
          70% {
            clip-path: circle(150% at calc(100% - 3rem) 2rem);
            opacity: 0.8;
          }
          100% {
            clip-path: circle(0% at calc(100% - 3rem) 2rem);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default App
