// Weather code descriptions
const weatherDescriptions: { [key: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
}

export function getWeatherDescription(code: number): string {
  return weatherDescriptions[code] || "Unknown"
}

export async function searchLocation(cityName: string) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error searching location:", error)
    return []
  }
}

export async function getWeatherData(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  })
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

// Add these helper functions at the end of the file:

export function formatDateInLanguage(date: Date, t: (key: string) => string): string {
  const dayNames = {
    0: t("days.sunday"),
    1: t("days.monday"),
    2: t("days.tuesday"),
    3: t("days.wednesday"),
    4: t("days.thursday"),
    5: t("days.friday"),
    6: t("days.saturday"),
  }

  const monthNames = {
    0: t("months.january"),
    1: t("months.february"),
    2: t("months.march"),
    3: t("months.april"),
    4: t("months.may"),
    5: t("months.june"),
    6: t("months.july"),
    7: t("months.august"),
    8: t("months.september"),
    9: t("months.october"),
    10: t("months.november"),
    11: t("months.december"),
  }

  const dayName = dayNames[date.getDay() as keyof typeof dayNames]
  const monthName = monthNames[date.getMonth() as keyof typeof monthNames]
  const day = date.getDate()

  return `${dayName}, ${day} ${monthName}`
}

export function formatDayInLanguage(date: Date, t: (key: string) => string): string {
  const dayNames = {
    0: t("days.sunday"),
    1: t("days.monday"),
    2: t("days.tuesday"),
    3: t("days.wednesday"),
    4: t("days.thursday"),
    5: t("days.friday"),
    6: t("days.saturday"),
  }

  return dayNames[date.getDay() as keyof typeof dayNames]
}
