function ForecastSection({ title, type, data }) {
  if (!data || !data.length) return null;

  // 🔥 Better weather icons (no more dots)
  const getCustomIcon = (icon) => {
    if (icon.includes("01")) return "☀️";
    if (icon.includes("02")) return "🌤️";
    if (icon.includes("03") || icon.includes("04")) return "☁️";
    if (icon.includes("09") || icon.includes("10")) return "🌧️";
    if (icon.includes("11")) return "⛈️";
    if (icon.includes("13")) return "❄️";
    if (icon.includes("50")) return "🌫️";
    return "☁️";
  };

  return (
    <div className="glass-card">
      <h3 className="section-title">{title}</h3>

      {/* Hourly */}
      {type === "hourly" && (
        <div className="hourly-row">
          {data.map((item, index) => (
            <div className="hour-item" key={index}>
              <p>{item.time}</p>

              <div className="forecast-icon-text">
                {getCustomIcon(item.icon)}
              </div>

              <p>{item.temp}°</p>
            </div>
          ))}
        </div>
      )}

      {/* Daily */}
      {type === "daily" && (
        <div className="daily-list">
          {data.map((item, index) => (
            <div className="day-row" key={index}>
              <span className="day-name">{item.day}</span>

              <div className="daily-icon-text">
                {getCustomIcon(item.icon)}
              </div>

              <span className="low-temp">{item.low}°</span>

              <div className="range-bar">
                <div
                  className="range-fill"
                  style={{
                    width: `${Math.max(
                      20,
                      Math.min(100, ((item.high - item.low) / 40) * 100)
                    )}%`,
                  }}
                ></div>
              </div>

              <span className="high-temp">{item.high}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ForecastSection;