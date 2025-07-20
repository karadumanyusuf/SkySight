"use client"

import AnimatedWeatherIcon from "./AnimatedWeatherIcon"
import { getWeatherDescription } from "@/lib/weatherUtils"
import { useLanguage } from "@/lib/languageContext"

interface DailyForecastProps {
  data: any
  isDark: boolean
}

const formatDayInLanguage = (date: Date, t: (key: string) => string) => {
  const day = date.toLocaleDateString(t("locale"), { weekday: "long" })
  return day.charAt(0).toUpperCase() + day.slice(1)
}

export default function DailyForecast({ data, isDark }: DailyForecastProps) {
  const { t } = useLanguage()

  const next7Days = data.time.slice(0, 7).map((date: string, index: number) => ({
    date,
    weather_code: data.weather_code[index],
    temp_max: data.temperature_2m_max[index],
    temp_min: data.temperature_2m_min[index],
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-2xl font-light text-white mb-6">{t("dailyForecast")}</h3>
      <div className="grid gap-4">
        {next7Days.map((day, index) => (
          <div
            key={day.date}
            className="flex items-center justify-between p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <AnimatedWeatherIcon code={day.weather_code} size="small" />
              <div>
                <p className="text-white font-medium">
                  {index === 0 ? t("today") : index === 1 ? t("tomorrow") : formatDayInLanguage(new Date(day.date), t)}
                </p>
                <p className="text-white/60 text-sm">{t(`weather.${getWeatherDescription(day.weather_code)}`)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{Math.round(day.temp_max)}°</span>
                <span className="text-white/60">{Math.round(day.temp_min)}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
