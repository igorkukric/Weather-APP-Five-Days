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
      const todayWeatherIconCode = data.list[0].weather[0].icon;

      todayInfo.querySelector("h2").textContent = new Date().toDateString(
        "en",
        { weekday: "long" }
      );
      todayInfo.querySelector("span").textContent = new Date().toDateString(
        "en",
        { day: "numeric", month: "long", year: "numeric" }
      );
      todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
      todayTemp.textContent = todayTemperature;

      // Update location and weather description in the "left-info" section
      const LocationElement = document.querySelector(
        ".today-info > div > span"
      );
      LocationElement.textContent = `${data.city.name}, ${data.city.country}`;

      const weatherDescriptionElement = document.querySelector(
        ".today-weather > h3"
      );
      weatherDescriptionElement.textContent = todayWeather;

      // Update todays info in the "day-info" section
      const todayPrecipitation = `${data.list[0].pop}%`;
      const todayHumidity = `${data.list[0].main.humidity}%`;
      const todayWindSpeed = `${data.list[0].wind.speed}km/h`;

      const dayInfoContainer = document.querySelector(".day-info");
      dayInfoContainer.innerHTML = `
        
            <div>
                <span class="title">PRECIPITATION</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">HUMIDITY</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">WIND SPEED</span>
                <span class="value">${todayWindSpeed}</span>
            </div>


      `;

      
    });
}
