const LAST_CITY_KEY = "lastSearchedCity";

export function saveLastCity(city) {
  localStorage.setItem(LAST_CITY_KEY, city);
}

export function getLastCity() {
  return localStorage.getItem(LAST_CITY_KEY);
}