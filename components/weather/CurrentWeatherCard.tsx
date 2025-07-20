"use client"

import type React from "react"

import { Wind, Droplets, Eye, Thermometer } from "lucide-react"
import AnimatedWeatherIcon from "./AnimatedWeatherIcon"
import { getWeatherDescription } from "@/lib/weatherUtils"
import { useLanguage } from "@/lib/languageContext"
import { formatDateInLanguage } from "@/lib/dateUtils"

interface CurrentWeatherCardProps {
  data: any
  location: any
  isDark: boolean
}

export default function CurrentWeatherCard({ data, location, isDark }: CurrentWeatherCardProps) {
  const { t } = useLanguage()

  return (
    <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-6xl md:text-7xl font-light text-white mb-2">{Math.round(data.temperature_2m)}°</h2>
          <p className="text-xl text-white/80 mb-1">{t(`weather.${getWeatherDescription(data.weather_code)}`)}</p>
          <p className="text-white/60 flex items-center">
            <span className="mr-2">📍</span>
            {location?.name}, {location?.country}
          </p>
        </div>
        <div className="text-right">
          <AnimatedWeatherIcon code={data.weather_code} size="large" />
          <p className="text-white/60 text-sm mt-2">{formatDateInLanguage(new Date(), t)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <WeatherDetail
          icon={<Wind className="w-5 h-5" />}
          label={t("windSpeed")}
          value={`${data.wind_speed_10m} km/h`}
        />
        <WeatherDetail icon={<Droplets className="w-5 h-5" />} label={t("humidity")} value="65%" />
        <WeatherDetail icon={<Eye className="w-5 h-5" />} label={t("visibility")} value="10 km" />
        <WeatherDetail
          icon={<Thermometer className="w-5 h-5" />}
          label={t("feelsLike")}
          value={`${Math.round(data.temperature_2m + 2)}°`}
        />
      </div>
    </div>
  )
}

function WeatherDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-white/10 backdrop-blur-sm">
      <div className="text-white/80 mb-2 flex justify-center">{icon}</div>
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  )
}
