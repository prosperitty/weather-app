import './style.scss';
// import { altGetWeatherData } from './alternate';
export { displayCurrentWeather, displayForecast, updateBackground };

const weatherAPI = process.env.WEATHER_API;
const giphyAPI = process.env.GIPHY_API;
const form = document.querySelector('form');
const cityInput = document.querySelector('input[type="text"]');
const cityName = document.querySelector('.temperature-city');

form.addEventListener('submit', (e) => {
  if (!cityInput.validity.valid) {
    showError();
    e.preventDefault();
  } else {
    cityInput.textContent = 'loading...';
    getWeatherData(cityInput.value);
    console.log('highfive');
    cityInput.value = '';
    e.preventDefault();
  }
});

cityInput.addEventListener('input', () => {
  if (cityInput.validity.valid) {
    console.log('valid');
  } else {
    showError();
  }
});

async function getCurrentWeather(city) {
  try {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`,
      { mode: 'cors' }
    );
    const currentData = await res.json();
    return currentData;
  } catch (err) {
    console.error('issue fetching current weather', err);
  }
}

async function getForecast(city) {
  try {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&cnt=4&appid=${weatherAPI}`,
      { mode: 'cors' }
    );
    const forecastData = await res.json();
    return forecastData;
  } catch (err) {
    console.error('issue fetching forecast', err);
  }
}

async function getGifByID(gifID) {
  try {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/${gifID}?api_key=${giphyAPI}`,
      { mode: 'cors' }
    );
    const gifData = await res.json();
    return gifData.data.images.original.url;
  } catch (err) {
    console.error('there was an issue with fetching gif', err);
  }
}

async function getWeatherData(city) {
  try {
    const currentWeatherData = getCurrentWeather(city);
    const forecastData = getForecast(city);

    const weatherData = await Promise.all([currentWeatherData, forecastData]);
    const gifUrl = await findGif(weatherData[0].weather[0].icon);

    displayCurrentWeather(weatherData[0]);
    displayForecast(weatherData[1]);
    updateBackground(gifUrl);
  } catch (err) {
    console.error(err);
  }
}

function showError() {
  if (cityInput.validity.patternMismatch) {
    console.log('invalid character');
  }
}

function findGif(iconID) {
  const snowGifID = 'gH2bKIakvLuW4';
  const thunderstormGifID = 'xUNd9G55SW8cV2IP6w';
  const rainGifID = 'l0MYAfxbg3fhqn1Ru';
  const clearSkyNightGifID = 'bAmpRgACntwA0';
  const clearSkyDayGifID = 'o7R0zQ62m8Nk4';
  const fewCloudsDayGifID = 'h0VzgrFX9AKXK';
  const fewCloudsNightGifID = '3o6ZtcUJcZo4fWotTW';
  const scatteredCloudsDayGifID = '4b8Oi4TXZDStG';
  const scatteredCloudsNightGifID = 'wwjEPjqcuPwvS';
  const cloudyDayGifID = 'jOafPZq6WvCZIjXka3';
  const cloudyNightGifID = '3ofT5LedjNAjQwYJ3O';
  const fogGifID = 'oAbvMXvah1M0U';

  if (iconID === '01d') {
    console.log('clear sky day');
    return getGifByID(clearSkyDayGifID);
  } else if (iconID === '01n') {
    console.log('clear sky night');
    return getGifByID(clearSkyNightGifID);
  } else if (iconID === '02d') {
    console.log('few clouds day');
    return getGifByID(fewCloudsDayGifID);
  } else if (iconID === '02n') {
    console.log('few clouds night');
    return getGifByID(fewCloudsNightGifID);
  } else if (iconID === '03d') {
    console.log('scattered clouds day');
    return getGifByID(scatteredCloudsDayGifID);
  } else if (iconID === '03n') {
    console.log('scattered clouds night');
    return getGifByID(scatteredCloudsNightGifID);
  } else if (iconID === '04d') {
    console.log('cloudy day');
    return getGifByID(cloudyDayGifID);
  } else if (iconID === '04n') {
    console.log('cloudy night');
    return getGifByID(cloudyNightGifID);
  } else if (iconID === '11d' || iconID === '11n') {
    console.log('thunderstorm');
    return getGifByID(thunderstormGifID);
  } else if (iconID === '13d' || iconID === '13n') {
    console.log('snow');
    getGifByID(snowGifID);
  } else if (iconID === '50d' || iconID === '50n') {
    console.log('fog');
    return getGifByID(fogGifID);
  } else if (
    iconID === '09d' ||
    iconID === '09n' ||
    iconID === '10d' ||
    iconID === '10n'
  ) {
    console.log('rain');
    return getGifByID(rainGifID);
  }
}

function updateBackground(source) {
  const backgroundImage = document.querySelector('.background-image');
  backgroundImage.src = source;
}

function displayWeatherCondition(condition) {
  const weatherCondition = document.querySelector('.temperature-condition');
  weatherCondition.textContent = condition;
}

function displayCurrentTemperature(temperature) {
  const currentTemperature = document.querySelector('.temperature-current');
  currentTemperature.textContent = roundTemperature(temperature);
}

function displayCityName(city) {
  cityName.textContent = city;
}

function displayHighLow(high, low) {
  const temperatureHigh = document.querySelector('.temperature-high');
  const temperatureLow = document.querySelector('.temperature-low');

  temperatureHigh.textContent = roundTemperature(high);
  temperatureLow.textContent = roundTemperature(low);
}

function displayFeelsLike(temperature) {
  const temperatureFeelsLike = document.querySelector(
    '.temperature-feels-like'
  );
  temperatureFeelsLike.textContent = roundTemperature(temperature);
}

function displayHumidity(percentage) {
  const humidity = document.querySelector('.temperature-humidity');
  humidity.textContent = percentage;
}

function displayWeatherIcon(id) {
  const weatherIcon = document.querySelector('.temperature-icon');
  weatherIcon.src = `http://openweathermap.org/img/wn/${id}@2x.png`;
}

function displayForecastIcons(index, id) {
  const forecastIcons = document.querySelectorAll('.forecast-condition');
  forecastIcons[index].src = `http://openweathermap.org/img/wn/${id}@2x.png`;
}

function displayForecastTemperature(index, temperature) {
  const forecastTemperature = document.querySelectorAll(
    '.forecast-temperature'
  );
  forecastTemperature[index].textContent = roundTemperature(temperature);
}

function displayForecastTime(index, time) {
  const forecastTime = document.querySelectorAll('.forecast-time');
  forecastTime[index].textContent = convertUnixTimeStamp(time);
}

function displayCurrentWeather(currentWeatherData) {
  displayCurrentTemperature(currentWeatherData.main.temp);
  displayCityName(currentWeatherData.name);
  displayFeelsLike(currentWeatherData.main.feels_like);
  displayHumidity(currentWeatherData.main.humidity);
  displayWeatherIcon(currentWeatherData.weather[0].icon);
  displayHighLow(
    currentWeatherData.main.temp_max,
    currentWeatherData.main.temp_min
  );
  displayWeatherCondition(
    currentWeatherData.weather[0].description,
    currentWeatherData.weather[0].icon
  );
}

function displayForecast(forecastData) {
  forecastData.list.forEach((e, i) => {
    displayForecastIcons(i, e.weather[0].icon);
    displayForecastTemperature(i, e.main.temp);
    displayForecastTime(i, e.dt);
  });
}

function roundTemperature(num) {
  let roundedNum = Math.round(num);
  return roundedNum;
}

function convertUnixTimeStamp(unix) {
  let date = new Date(unix * 1000);
  let hours = date.getHours();
  let AmOrPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  let formatTime = `${hours}${AmOrPm}`;
  return formatTime;
}

getWeatherData('new york');
