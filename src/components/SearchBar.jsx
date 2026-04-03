import { useState } from "react";

function SearchBar({ onSearch, onUseLocation }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!city.trim()) return;

    onSearch(city.trim());
    setCity("");
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search any city in the world"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <button className="location-button" onClick={onUseLocation}>
        Use Location
      </button>
    </div>
  );
}

export default SearchBar;