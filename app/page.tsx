"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard"
import DailyForecast from "@/components/weather/DailyForecast"
import WeatherHighlights from "@/components/weather/WeatherHighlights"
import HourlyForecast from "@/components/weather/HourlyForecast"
import Footer from "@/components/Footer"
import { searchLocation, getWeatherData } from "@/lib/weatherUtils"
import { getCurrentLocationByIP, isTurkishLocation } from "@/lib/locationUtils"
import { useLanguage } from "@/lib/languageContext"

export default function Home() {
  const { t, language, setLanguage } = useLanguage()
  const [weatherData, setWeatherData] = useState(null as any)
const [location, setLocation] = useState<LocationType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [initialLocationDetected, setInitialLocationDetected] = useState(false)
  type LocationType = {
  name: string
  country: string
  latitude: number
  longitude: number
  admin1: string
  timezone: string
}


  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme")
    setIsDark(savedTheme === "dark")

    // Load initial location
    loadInitialLocation()
  }, [])

  const loadInitialLocation = async () => {
    setLoading(true)
    try {
      // Check if we have a saved location first
      const savedLocation = localStorage.getItem("lastLocation")

      if (savedLocation && !initialLocationDetected) {
        const parsedLocation = JSON.parse(savedLocation)
        setLocation(parsedLocation)
        const weather = await getWeatherData(parsedLocation.latitude, parsedLocation.longitude)
        setWeatherData(weather)
        setInitialLocationDetected(true)
      } else {
        // Get user's location by IP
        const ipLocation = await getCurrentLocationByIP()

        // If user is in Turkey, set language to Turkish automatically
        if (isTurkishLocation(ipLocation) && language === "en") {
          setLanguage("tr")
        }

        // Create location object compatible with our system
        const locationData = {
          name: ipLocation.city,
          country: ipLocation.country,
          latitude: ipLocation.latitude,
          longitude: ipLocation.longitude,
          admin1: ipLocation.region,
          timezone: ipLocation.timezone,
        }

        setLocation(locationData)

        // Get weather data for detected location
        const weather = await getWeatherData(ipLocation.latitude, ipLocation.longitude)
        setWeatherData(weather)

        // Save detected location
        localStorage.setItem("lastLocation", JSON.stringify(locationData))
        setInitialLocationDetected(true)
      }
    } catch (error) {
      console.error("Error loading initial location:", error)
      // Fallback to Istanbul
      handleLocationSearch("İstanbul")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async (cityName: string) => {
    setLoading(true)
    try {
      const locationData = await searchLocation(cityName)
      if (locationData && locationData.length > 0) {
        const selectedLocation = locationData[0]
        setLocation(selectedLocation)

        const weather = await getWeatherData(selectedLocation.latitude, selectedLocation.longitude)
        setWeatherData(weather)

        // Save to localStorage
        localStorage.setItem("lastLocation", JSON.stringify(selectedLocation))
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : weatherData?.current?.weather_code === 0
            ? "bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500"
            : weatherData?.current?.weather_code <= 3
              ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600"
              : "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <Header onSearch={handleLocationSearch} isDark={isDark} onThemeToggle={toggleTheme} />

        <main className="mt-8 space-y-8">
          {loading ? (
            <div className="text-center">
              <div className="glass-card p-8 max-w-md mx-auto">
                <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                <p className="text-white/80 text-lg mb-2">
                  {language === "tr" ? "Konumunuz tespit ediliyor..." : "Detecting your location..."}
                </p>
                <p className="text-white/60 text-sm">
                  {language === "tr" ? "Hava durumu bilgileri yükleniyor" : "Loading weather information"}
                </p>
              </div>
            </div>
          ) : weatherData ? (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <CurrentWeatherCard data={weatherData.current} location={location} isDark={isDark} />
                </div>
                <div>
                  <WeatherHighlights data={weatherData.current} isDark={isDark} />
                </div>
              </div>

              <HourlyForecast data={weatherData.hourly} isDark={isDark} />

              <DailyForecast data={weatherData.daily} isDark={isDark} />
            </>
          ) : (
            <div className="text-center text-white/80">
              <p className="text-xl">{t("searchForCity")}</p>
            </div>
          )}
        </main>

        <Footer onLocationChange={handleLocationSearch} onThemeToggle={toggleTheme} isDark={isDark} />
      </div>
    </div>
  ) 
}
