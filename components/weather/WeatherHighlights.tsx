"use client"

import { Wind, Droplets, Gauge, Sun } from "lucide-react"
import { useLanguage } from "@/lib/languageContext"

interface WeatherHighlightsProps {
  data: any
  isDark: boolean
}

export default function WeatherHighlights({ data, isDark }: WeatherHighlightsProps) {
  const { t } = useLanguage()

  const highlights = [
    {
      title: t("windSpeed"),
      value: `${data.wind_speed_10m} km/h`,
      icon: <Wind className="w-6 h-6" />,
      description: t("lightBreeze"),
    },
    {
      title: t("humidity"),
      value: "65%",
      icon: <Droplets className="w-6 h-6" />,
      description: t("comfortable"),
    },
    {
      title: t("uvIndex"),
      value: "6",
      icon: <Sun className="w-6 h-6" />,
      description: t("high"),
    },
    {
      title: t("pressure"),
      value: "1013 hPa",
      icon: <Gauge className="w-6 h-6" />,
      description: t("normal"),
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-light text-white mb-4">{t("weatherHighlights")}</h3>
      {highlights.map((highlight, index) => (
        <div key={highlight.title} className="glass-card p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="text-white/80">{highlight.icon}</div>
              <span className="text-white/80 text-sm">{highlight.title}</span>
            </div>
          </div>
          <div className="text-2xl font-semibold text-white mb-1">{highlight.value}</div>
          <div className="text-white/60 text-sm">{highlight.description}</div>
        </div>
      ))}
    </div>
  )
}
