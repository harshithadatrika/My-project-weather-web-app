function WeatherCard({ weather, now }) {
  if (!weather) return null;

  const getLocalTime = (timezoneOffset) => {
    const utcNow = now + new Date().getTimezoneOffset() * 60000;
    const cityTime = new Date(utcNow + timezoneOffset * 1000);

    return cityTime.toLocaleString([], {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const locationText = weather.sys?.country
    ? `${weather.name}, ${weather.sys.country}`
    : weather.name;

  return (
    <div className="current-weather">
      <p className="location-tag">My Location · {getLocalTime(weather.timezone)}</p>

      <h1 className="city-title">{locationText}</h1>

      <div className="temperature">{Math.round(weather.main.temp)}°</div>

      <p className="condition-text">{weather.weather[0].main}</p>
      <p className="weather-summary">{weather.weather[0].description}</p>

      <p className="meta-text">
        Feels Like: {Math.round(weather.main.feels_like)}°
      </p>

      <p className="meta-text">
        H:{Math.round(weather.main.temp_max)}° &nbsp; L:{Math.round(weather.main.temp_min)}°
      </p>
    </div>
  );
}

export default WeatherCard;