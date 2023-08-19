const apiKey = "4480352f3e978527b52b9e68add6b0e0";
const locButton = document.querySelector(".loc-button");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTemp = document.querySelector("weather-temp");
const daysList = document.querySelector(".days-list");

// Mapping of weather condition codes to icon class names (Depending on Openweather Api Response)
const weatherIconMap = {
  "01d": "sun",
  "01n": "moon",
  "02d": "sun",
  "02n": "moon",
  "03d": "cloud",
  "03n": "cloud",
  "04d": "cloud",
  "04n": "cloud",
  "09d": "cloud-rain",
  "09n": "cloud-rain",
  "10d": "cloud-rain",
  "10n": "cloud-rain",
  "11d": "cloud-lightning",
  "11n": "cloud-lightning",
  "13d": "cloud-snow",
  "13n": "cloud-snow",
  "50d": "water",
  "50n": "water",
};

function fetchWeatherData(location) {
  //construct the API url with the location and api key
  const apiUrl = `api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  // Fetch weather data from api
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Update todays info
      const todayWeather = data.list[0].weather[0].description;
      const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
    });
}
