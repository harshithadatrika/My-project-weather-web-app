const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const CURRENT_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";

export async function getCoordinatesByCity(city) {
  const response = await fetch(
    `${GEO_BASE_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch city coordinates.");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("City not found. Please enter a valid city.");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    state: data[0].state || "",
    country: data[0].country,
  };
}

export async function getCurrentWeatherByCoords(lat, lon) {
  const response = await fetch(
    `${CURRENT_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current weather.");
  }

  return await response.json();
}

export async function getForecastByCoords(lat, lon) {
  const response = await fetch(
    `${FORECAST_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data.");
  }

  return await response.json();
}

export async function getWeatherDataByCity(city) {
  const coords = await getCoordinatesByCity(city);

  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeatherByCoords(coords.lat, coords.lon),
    getForecastByCoords(coords.lat, coords.lon),
  ]);

  return { currentWeather, forecast };
}

export async function getWeatherDataByLocation(lat, lon) {
  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeatherByCoords(lat, lon),
    getForecastByCoords(lat, lon),
  ]);

  return { currentWeather, forecast };
}