"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Languages, Sun, Moon, X } from "lucide-react"
import { useLanguage } from "@/lib/languageContext"
import { searchLocation } from "@/lib/weatherUtils"

interface HeaderProps {
  onSearch: (city: string) => void
  isDark: boolean
  onThemeToggle: () => void
}

export default function Header({ onSearch, isDark, onThemeToggle }: HeaderProps) {
  const { t, language, setLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const searchRef = useRef<HTMLDivElement>(null)

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr")
  }

  // Debounced search function
  useEffect(() => {
    if (searchQuery.length >= 3) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setLoading(true)
        try {
          const results = await searchLocation(searchQuery)
          // Sort by population (if available) and relevance
          const sortedResults = results.slice(0, 8).sort((a: any, b: any) => {
            // Prioritize exact matches
            if (a.name.toLowerCase() === searchQuery.toLowerCase()) return -1
            if (b.name.toLowerCase() === searchQuery.toLowerCase()) return 1

            // Then by population
            return (b.population || 0) - (a.population || 0)
          })

          setSuggestions(sortedResults)
          setShowSuggestions(true)
        } catch (error) {
          console.error("Search error:", error)
          setSuggestions([])
        } finally {
          setLoading(false)
        }
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setSearchQuery("")
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    const cityName = `${suggestion.name}, ${suggestion.country}`
    onSearch(cityName)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <header className="text-center">
      {/* Theme and Language Controls */}
      <div className="flex justify-end items-center space-x-4 mb-8">
        <button
          onClick={toggleLanguage}
          className="glass-card p-3 hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          title={language === "tr" ? "Switch to English" : "Türkçe'ye geç"}
        >
          <Languages className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{language === "tr" ? "EN" : "TR"}</span>
        </button>

        <button
          onClick={onThemeToggle}
          className="glass-card p-3 hover:scale-105 transition-all duration-200"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-2 animate-fade-in">{t("title")}</h1>
        <p className="text-white/80 text-lg animate-fade-in-delay">{t("subtitle")}</p>
      </div>

      {/* Search with Suggestions */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div
          ref={searchRef}
          className={`relative z-50 transition-all duration-300 ${isFocused ? "scale-105" : "scale-100"}`}
        >
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking
                  setTimeout(() => setIsFocused(false), 200)
                }}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg"
                autoComplete="off"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              )}

              <button
                type="submit"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (suggestions.length > 0 || loading) && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 z-[9999] max-h-80 overflow-y-auto shadow-2xl">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto"></div>
                  <p className="text-white/60 text-sm mt-2">{language === "tr" ? "Aranıyor..." : "Searching..."}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {suggestions.map((suggestion: any, index) => (
                    <button
                      key={`${suggestion.name}-${suggestion.country}-${index}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/20 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium group-hover:text-white/90">{suggestion.name}</p>
                          <p className="text-white/60 text-sm">
                            {suggestion.admin1 && `${suggestion.admin1}, `}
                            {suggestion.country}
                          </p>
                        </div>
                        {suggestion.population && (
                          <div className="text-white/40 text-xs">{(suggestion.population / 1000000).toFixed(1)}M</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </header>
  )
}
