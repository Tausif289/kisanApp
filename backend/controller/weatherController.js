import fetch from "node-fetch";

/**
 * Get weather data for a specific location
 * Provides farming-specific insights based on weather conditions
 */
export const getWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location parameter is required",
      });
    }

    // Using OpenWeatherMap API (free tier)
    // Note: Add WEATHER_API_KEY to .env file
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "demo";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Unable to fetch weather data. Please check the location name.",
      });
    }

    const data = await response.json();

    // Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      location
    )}&appid=${WEATHER_API_KEY}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = forecastResponse.ok
      ? await forecastResponse.json()
      : null;

    // Extract relevant weather information
    const weatherInfo = {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      clouds: data.clouds.all,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Generate farming-specific insights
    const farmingInsights = generateFarmingInsights(weatherInfo, forecastData);

    res.json({
      success: true,
      weather: weatherInfo,
      forecast: forecastData
        ? forecastData.list.slice(0, 8).map((item) => ({
            time: new Date(item.dt * 1000).toLocaleString("en-IN"),
            temp: Math.round(item.main.temp),
            description: item.weather[0].description,
            humidity: item.main.humidity,
            rain: item.rain ? item.rain["3h"] || 0 : 0,
          }))
        : [],
      farmingInsights,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching weather data",
      error: error.message,
    });
  }
};

/**
 * Generate farming-specific insights based on weather conditions
 */
function generateFarmingInsights(weather, forecast) {
  const insights = [];

  // Temperature-based insights
  if (weather.temperature > 35) {
    insights.push({
      type: "warning",
      category: "temperature",
      message:
        "High temperature detected. Increase irrigation frequency and consider providing shade for sensitive crops.",
      messageHi:
        "तापमान बहुत अधिक है। सिंचाई की आवृत्ति बढ़ाएं और संवेदनशील फसलों के लिए छाया प्रदान करें।",
    });
  } else if (weather.temperature < 10) {
    insights.push({
      type: "warning",
      category: "temperature",
      message:
        "Low temperature alert. Protect crops from frost. Consider covering sensitive plants.",
      messageHi:
        "कम तापमान चेतावनी। फसलों को पाले से बचाएं। संवेदनशील पौधों को ढकने पर विचार करें।",
    });
  } else if (weather.temperature >= 20 && weather.temperature <= 30) {
    insights.push({
      type: "info",
      category: "temperature",
      message:
        "Ideal temperature for most crops. Good conditions for sowing and growth.",
      messageHi:
        "अधिकांश फसलों के लिए आदर्श तापमान। बुवाई और वृद्धि के लिए अच्छी स्थिति।",
    });
  }

  // Humidity-based insights
  if (weather.humidity > 80) {
    insights.push({
      type: "warning",
      category: "humidity",
      message:
        "High humidity may increase fungal disease risk. Monitor crops closely and avoid overhead irrigation.",
      messageHi:
        "उच्च आर्द्रता से फंगल रोग का खतरा बढ़ सकता है। फसलों की बारीकी से निगरानी करें और ऊपर से सिंचाई से बचें।",
    });
  } else if (weather.humidity < 30) {
    insights.push({
      type: "info",
      category: "humidity",
      message:
        "Low humidity detected. Increase irrigation to prevent crop stress.",
      messageHi:
        "कम आर्द्रता का पता चला। फसल तनाव को रोकने के लिए सिंचाई बढ़ाएं।",
    });
  }

  // Rain forecast insights
  if (forecast && forecast.list) {
    const rainInNext24Hours = forecast.list
      .slice(0, 8)
      .some((item) => item.rain && item.rain["3h"] > 0);

    if (rainInNext24Hours) {
      insights.push({
        type: "info",
        category: "rain",
        message:
          "Rain expected in next 24 hours. Postpone irrigation and fertilizer application.",
        messageHi:
          "अगले 24 घंटों में बारिश की संभावना। सिंचाई और उर्वरक प्रयोग स्थगित करें।",
      });
    }
  }

  // Wind-based insights
  if (weather.windSpeed > 10) {
    insights.push({
      type: "warning",
      category: "wind",
      message:
        "Strong winds detected. Avoid pesticide spraying. Secure tall crops and structures.",
      messageHi:
        "तेज हवाएं चल रही हैं। कीटनाशक छिड़काव से बचें। लंबी फसलों और संरचनाओं को सुरक्षित करें।",
    });
  }

  // General recommendations
  if (insights.length === 0) {
    insights.push({
      type: "success",
      category: "general",
      message:
        "Weather conditions are favorable for farming activities. Good time for field operations.",
      messageHi:
        "मौसम की स्थिति खेती की गतिविधियों के लिए अनुकूल है। खेत के कार्यों के लिए अच्छा समय।",
    });
  }

  return insights;
}
