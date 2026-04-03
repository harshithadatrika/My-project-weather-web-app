import { useEffect, useMemo, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastSection from "./components/ForecastSection";
import Loading from "./components/Loading";
import {
  getWeatherDataByCity,
  getWeatherDataByLocation,
} from "./services/weatherService";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const weatherTheme = useMemo(() => {
    if (!currentWeather) return "theme-day";

    const nowUtcSeconds = Date.now() / 1000;
    const timezoneOffset = currentWeather.timezone;

    const localTimeSeconds = nowUtcSeconds + timezoneOffset;
    const sunrise = currentWeather.sys.sunrise;
    const sunset = currentWeather.sys.sunset;

    const isNight =
      localTimeSeconds < sunrise || localTimeSeconds > sunset;

    return isNight ? "theme-night" : "theme-day";
  }, [currentWeather]);

  const formatHour = (dtTxt, timezoneOffset) => {
    const utcDate = new Date(dtTxt + " UTC");
    const cityTime = new Date(utcDate.getTime() + timezoneOffset * 1000);

    return cityTime.toLocaleTimeString([], {
      hour: "numeric",
      hour12: true,
      timeZone: "UTC",
    });
  };

  const formatDay = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString([], { weekday: "short" });
  };

  const buildHourlyForecast = (list, timezoneOffset) => {
    return list.slice(0, 8).map((item) => ({
      time: formatHour(item.dt_txt, timezoneOffset),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }));
  };

  const buildDailyForecast = (list) => {
    const map = {};

    list.forEach((item) => {
      const dateKey = item.dt_txt.split(" ")[0];

      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          temps: [],
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        };
      }

      map[dateKey].temps.push(item.main.temp_min);
      map[dateKey].temps.push(item.main.temp_max);
    });

    return Object.values(map)
      .slice(0, 5)
      .map((day) => ({
        day: formatDay(day.date),
        low: Math.round(Math.min(...day.temps)),
        high: Math.round(Math.max(...day.temps)),
        icon: day.icon,
        description: day.description,
      }));
  };

  const updateWeatherState = (currentWeatherData, forecastData) => {
    setCurrentWeather(currentWeatherData);
    setHourlyData(
      buildHourlyForecast(forecastData.list, currentWeatherData.timezone)
    );
    setDailyData(buildDailyForecast(forecastData.list));
  };

  const clearWeatherState = () => {
    setCurrentWeather(null);
    setHourlyData([]);
    setDailyData([]);
  };

  const loadWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setError("");

      const { currentWeather, forecast } = await getWeatherDataByCity(city);
      updateWeatherState(currentWeather, forecast);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      clearWeatherState();
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);
          setError("");

          const { latitude, longitude } = position.coords;
          const { currentWeather, forecast } =
            await getWeatherDataByLocation(latitude, longitude);

          updateWeatherState(currentWeather, forecast);
        } catch (err) {
          setError(err.message || "Failed to fetch weather from location.");
          clearWeatherState();
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        clearWeatherState();
      }
    );
  };

  useEffect(() => {
    loadWeatherByLocation();
  }, []);

  return (
    <div className={`app-shell ${weatherTheme}`}>
      <div className="sun-glow"></div>

      <div className="weather-screen">
        <SearchBar
          onSearch={loadWeatherByCity}
          onUseLocation={loadWeatherByLocation}
        />

        {loading && <Loading />}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && currentWeather && (
          <>
            <WeatherCard weather={currentWeather} now={now} />

            <ForecastSection
              title="Hourly Forecast"
              type="hourly"
              data={hourlyData}
            />

            <ForecastSection
              title="5-Day Forecast"
              type="daily"
              data={dailyData}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;