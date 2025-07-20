"use client"
import { Github, Heart } from "lucide-react"
import { useLanguage } from "@/lib/languageContext"

interface FooterProps {
  onLocationChange: (city: string) => void
  onThemeToggle: () => void
  isDark: boolean
}

export default function Footer({ onLocationChange, onThemeToggle, isDark }: FooterProps) {
  const { t, language } = useLanguage()

  const popularCities =
    language === "tr"
      ? ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana"]
      : ["New York", "London", "Tokyo", "Paris", "Sydney", "Dubai"]

  return (
    <footer className="mt-16 text-center">
      <div className="glass-card p-6 mb-8">
        <h4 className="text-white/80 text-sm mb-4">{t("popularCities")}</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => onLocationChange(city)}
              className="px-3 py-1 rounded-full bg-white/20 text-white/80 text-sm hover:bg-white/30 transition-colors duration-200"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-6 mb-8">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
        >
          <Github className="w-5 h-5 text-white" />
        </a>
      </div>

      <div className="text-white/60 text-sm">
        <p className="flex items-center justify-center space-x-1">
          <span>{t("madeWith")}</span>
          <Heart className="w-4 h-4 text-red-400" />
          <span>Open-Meteo API</span>
        </p>
        <p className="mt-2">© 2024 SkySight. {t("allRightsReserved")}</p>
      </div>
    </footer>
  )
}
