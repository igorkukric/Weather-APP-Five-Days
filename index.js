const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTemp = document.querySelector(".weather-temp");
const daysList = document.querySelector(".days-list");
const locButton = document.getElementById("searchButton");
const locationInput = document.getElementById("locationInput");

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
  "10d": "cloud-light-rain",
  "10n": "cloud-light-rain",
  "11d": "cloud-lightning",
  "11n": "cloud-lightning",
  "13d": "cloud-snow",
  "13n": "cloud-snow",
  "50d": "water",
  "50n": "water",
};
let timeUpdateInterval;

async function fetchWeatherData(location) {
  //construct the API url with the location and api key
  try {
    const apiKey = "4480352f3e978527b52b9e68add6b0e0";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const timezoneOffset = data.city.timezone;
    // Fetch weather data from api
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Update todays info and current time for each city

        function convertTimestampToTime(timestamp, timezoneOffset) {
          const adjustedTime = new Date(
            timestamp * 1000 + timezoneOffset * 1000
          );
          const hours = adjustedTime.getUTCHours();
          const formattedHours = hours.toString().padStart(2, "0");
          const minutes = adjustedTime
            .getUTCMinutes()
            .toString()
            .padStart(2, "0");
          return `${formattedHours}:${minutes}`;
        }

        function updateTime() {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const formattedTime = convertTimestampToTime(
            currentTimestamp,
            timezoneOffset
          );
          const timeElement = document.querySelector(".time");
          if (timeElement.textContent !== formattedTime) {
            timeElement.textContent = formattedTime;
          }

          // Set appropriate background class based on daytime/nighttime

          const currentUTC = new Date().getUTCHours();
          const hours = (currentUTC + timezoneOffset / 3600 + 24) % 24;

          let timePeriod;

          if (hours >= 5 && hours < 10) {
            timePeriod = "morning";
          } else if (hours >= 10 && hours < 17) {
            timePeriod = "day";
          } else if (hours >= 17 && hours < 20) {
            timePeriod = "evening";
          } else {
            timePeriod = "nighttime";
          }

          const backgroundClass = `left-info ${timePeriod}`;
          document.querySelector(".left-info").className = backgroundClass;

          // Adjust clock color based on daytime/nighttime

          const clockColor = hours >= 17 || hours < 5 ? "#fff" : "#0b212f";
          timeElement.style.color = clockColor;
        }
        if (timeUpdateInterval) {
          clearInterval(timeUpdateInterval);
        }
        updateTime();
        timeUpdateInterval = setInterval(updateTime, 1000);

        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;
        todayInfo.querySelector("h2").textContent =
          new Date().toLocaleDateString("en", { weekday: "long" });
        todayInfo.querySelector("span").textContent =
          new Date().toLocaleDateString("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
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
        const todayPrecipitation = `${data.list[0].pop} mm`;
        const todayHumidity = `${data.list[0].main.humidity} %`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;
        const todayPressure = `${data.list[0].main.pressure} mb`;
        const feelsLike = `${Math.round(data.list[0].main.feels_like)}°C `;
        console.log(data);
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
            <div>
                <span class="title">PRESSURE</span>
                <span class="value">${todayPressure}</span>
            </div>
            <div>
                <span class="title">FEELS LIKE</span>
                <span class="value">${feelsLike}</span>
            </div>


      `;

        // Update next 5 days weather
        const today = new Date();
        const nextDayData = data.list.slice(1);
        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = "";

        for (const DayData of nextDayData) {
          const forecastDate = new Date(DayData.dt_txt);
          const dayAbbreviation = forecastDate.toLocaleDateString("en", {
            weekday: "short",
          });
          const isDaytime =
            forecastDate.getHours() >= 12 && forecastDate.getHours() < 18;
          const dayTemp = `${Math.round(DayData.main.temp)}°C`;
          const iconCode = DayData.weather[0].icon;
          // Ensure the day isn't duplicate and today
          if (
            !uniqueDays.has(dayAbbreviation) &&
            forecastDate.getDate() !== today.getDate() &&
            isDaytime
          ) {
            uniqueDays.add(dayAbbreviation);

            daysList.innerHTML += `
            
                <li>
                    <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                    <span>${dayAbbreviation}</span>
                    <span class="day-temp">${dayTemp}
                    </span>
                </li>    
            
            `;
            count++;
          }

          // Stop after getting 5 distinct days
          if (count === 5) break;
        }
      });
  } catch (error) {
    const inputField = document.getElementById("locationInput");
    inputField.style.border = "1px solid #e00b0b";
    inputField.value = "City Not Found";
    inputField.addEventListener("input", clearError);
  }
}

function clearError() {
  const inputField = document.getElementById("locationInput");
  inputField.style.border = "";
  inputField.value = "";
  inputField.removeEventListener("input", clearError);
}

// Fetch weather data on document load for default location (Pancevo), and put in LocalStorage

document.addEventListener("DOMContentLoaded", () => {
  let location = localStorage.getItem("weatherAppLocation");

  if (!location) {
    location = "Pancevo";
  }
  localStorage.removeItem("weatherAppLocation");

  fetchWeatherData(location);
});

const searchWeather = async () => {
  const location = locationInput.value;
  if (!location) return;

  localStorage.setItem("weatherAppLocation", location);
  await fetchWeatherData(location);
};

locButton.addEventListener("click", searchWeather);
locationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});
