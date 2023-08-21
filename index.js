const apiKey = "4480352f3e978527b52b9e68add6b0e0";
const locButton = document.querySelector(".loc-button");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTemp = document.querySelector(".weather-temp");
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
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  console.log(location);
  // Fetch weather data from api
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Update todays info
      const todayWeather = data.list[0].weather[0].description;
      const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
      const todayWeatherIconCode = data.list[0].weather[0].icon;
      todayInfo.querySelector("h2").textContent = new Date().toLocaleDateString(
        "en",
        { weekday: "long" }
      );
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
      console.log(data);
      // Update todays info in the "day-info" section
      const todayPrecipitation = `${data.list[0].pop} %`;
      const todayHumidity = `${data.list[0].main.humidity} %`;
      const todayWindSpeed = `${data.list[0].wind.speed} km/h`;
      const todayPressure = `${data.list[0].main.pressure} mb`;
      const feelsLike = `${Math.round(data.list[0].main.feels_like)}°C `;

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

      // Update next 4 days weather
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
        const dayTemp = `${Math.round(DayData.main.temp)}°C`;
        const iconCode = DayData.weather[0].icon;

        // Ensure the day isn't duplicate and today
        if (
          !uniqueDays.has(dayAbbreviation) &&
          forecastDate.getDate() !== today.getDate()
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
    })
    .catch((error) => {
      alert(`Error fetching weather data: ${error} (Api Error)`);
    });
}

// Fetch weather data on document load for default location (Serbia)
document.addEventListener("DOMContentLoaded", () => {
  const defaultLocation = "Pancevo";
  fetchWeatherData(defaultLocation);
});

locButton.addEventListener("click", () => {
  const location = prompt("Enter a location :");
  if (!location) return;

  fetchWeatherData(location);
});
// Clock
function convertTimestampToTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function updateDesktopTime() {
  const timestamp = Date.now(1690664731);
  const formattedTime = convertTimestampToTime(timestamp);
  document.querySelector(".time").innerHTML = formattedTime;
}
setInterval(updateDesktopTime, 1000);

const timestamp = Date.now();
console.log(timestamp);

const allzone = document.getElementById("allzone");
currentTime = document.getElementById("currentTime");

currentTime.innerHTML = new Date().toLocaleString("en-us", {
  timeStyle: "full",
});

fetch('timezones.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(e => {
      const option = document.createElement('option');
      option.innerHTML = e.text;
      option.value = e.ianaTimezone;
      allzone.appendChild(option);
    });
  })
  .catch((err) => console.log(err));

 allzone.oninput = ()=> setInterval(time, 1000)

function time() {
 const selectedTimezone = allzone.value

  const ctime = new Date().toLocaleString("en-us", {
    timeZone: selectedTimezone,
    timeStyle: 'medium',
  });

  currentTime.innerText = ctime;
}
