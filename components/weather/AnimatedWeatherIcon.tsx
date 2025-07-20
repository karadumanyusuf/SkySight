"use client"

import { Sun, Cloud, CloudRain, CloudSnow, Zap } from "lucide-react"

interface AnimatedWeatherIconProps {
  code: number
  size?: "small" | "medium" | "large"
}

export default function AnimatedWeatherIcon({ code, size = "medium" }: AnimatedWeatherIconProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  }

  const getIcon = () => {
    switch (true) {
      case code === 0:
        return <Sun className={`${sizeClasses[size]} text-yellow-300 animate-pulse`} />
      case code >= 1 && code <= 3:
        return <Cloud className={`${sizeClasses[size]} text-white animate-pulse-slow`} />
      case code >= 51 && code <= 67:
        return <CloudRain className={`${sizeClasses[size]} text-blue-300 animate-bounce-slow`} />
      case code >= 71 && code <= 77:
        return <CloudSnow className={`${sizeClasses[size]} text-blue-100 animate-pulse-slower`} />
      case code >= 80 && code <= 99:
        return <Zap className={`${sizeClasses[size]} text-yellow-400 animate-pulse`} />
      default:
        return <Sun className={`${sizeClasses[size]} text-yellow-300 animate-pulse`} />
    }
  }

  return <div className="flex justify-center items-center">{getIcon()}</div>
}
