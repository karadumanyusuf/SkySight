"use client"

import AnimatedWeatherIcon from "./AnimatedWeatherIcon"
import { useLanguage } from "@/lib/languageContext"

interface HourlyForecastProps {
  data: any
  isDark: boolean
}

export default function HourlyForecast({ data, isDark }: HourlyForecastProps) {
  const { t } = useLanguage()

  const next24Hours = data.time.slice(0, 24).map((time: string, index: number) => ({
    time,
    temperature: data.temperature_2m[index],
    weather_code: data.weather_code?.[index] || 0,
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-2xl font-light text-white mb-6">{t("hourlyForecast")}</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {next24Hours.map((hour, index) => (
          <div
            key={hour.time}
            className="flex-shrink-0 text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200 min-w-[80px]"
          >
            <p className="text-white/60 text-sm mb-2">
              {index === 0
                ? t("now")
                : new Date(hour.time).toLocaleTimeString("tr-TR", {
                    hour: "numeric",
                    hour12: false,
                  })}
            </p>
            <div className="mb-2">
              <AnimatedWeatherIcon code={hour.weather_code} size="small" />
            </div>
            <p className="text-white font-semibold">{Math.round(hour.temperature)}°</p>
          </div>
        ))}
      </div>
    </div>
  )
}
