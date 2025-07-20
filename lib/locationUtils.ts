// IP-based location detection
export async function getCurrentLocationByIP() {
  try {
    // Using ipapi.co - free service, no API key required
    const response = await fetch("https://ipapi.co/json/")

    if (!response.ok) {
      throw new Error("Failed to fetch location")
    }

    const data = await response.json()

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      region: data.region,
      country: data.country_name,
      country_code: data.country_code,
      timezone: data.timezone,
    }
  } catch (error) {
    console.error("Error getting location by IP:", error)

    // Fallback to a secondary service
    try {
      const fallbackResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await fallbackResponse.json()

      // Use ip-api.com as fallback
      const locationResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`)
      const locationData = await locationResponse.json()

      if (locationData.status === "success") {
        return {
          latitude: locationData.lat,
          longitude: locationData.lon,
          city: locationData.city,
          region: locationData.regionName,
          country: locationData.country,
          country_code: locationData.countryCode,
          timezone: locationData.timezone,
        }
      }
    } catch (fallbackError) {
      console.error("Fallback location service also failed:", fallbackError)
    }

    // Final fallback - return Istanbul coordinates
    return {
      latitude: 41.0082,
      longitude: 28.9784,
      city: "Istanbul",
      region: "Istanbul",
      country: "Turkey",
      country_code: "TR",
      timezone: "Europe/Istanbul",
    }
  }
}

// Format location for display
export function formatLocationName(location: any, language = "en") {
  if (!location) return ""

  // For Turkish users, show Turkish city names if available
  const turkishCities: { [key: string]: string } = {
    Istanbul: "İstanbul",
    Ankara: "Ankara",
    Izmir: "İzmir",
    Bursa: "Bursa",
    Antalya: "Antalya",
    Adana: "Adana",
    Konya: "Konya",
    Gaziantep: "Gaziantep",
    Mersin: "Mersin",
    Diyarbakir: "Diyarbakır",
  }

  const cityName = language === "tr" && turkishCities[location.city] ? turkishCities[location.city] : location.city

  return `${cityName}, ${location.country}`
}

// Check if location is in Turkey
export function isTurkishLocation(location: any): boolean {
  return location?.country_code === "TR" || location?.country === "Turkey"
}
