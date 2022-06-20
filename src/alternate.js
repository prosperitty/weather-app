//this code is just an alternate method of requesting and displaying data using promises;
import {
  displayCurrentWeather,
  displayForecast,
  updateBackground,
} from './index';
export { altGetWeatherData };

const weatherAPI = process.env.WEATHER_API;
const giphyAPI = process.env.GIPHY_API;

function altGetWeatherData(city) {
  const currWeather = getAltCurrentWeather(city);
  const forecastWeather = getAltForecast(city);

  Promise.all([currWeather, forecastWeather])
    .then((responses) => {
      for (let response of responses) {
        if (!response.ok) {
          throw new Error(`response not ok. ${response.statusText}`);
        } else {
          return Promise.all(responses.map((res) => res.json()));
        }
      }
    })
    .then((data) => {
      const currentWeatherData = data[0];
      const forecastData = data[1];
      displayCurrentWeather(currentWeatherData);
      displayForecast(forecastData);
      return altGetGifByID(currentWeatherData.weather[0].icon);
    })
    .then((gifResponse) => {
      if (!gifResponse.ok) {
        throw new Error(`gif response not ok. ${gifResponse.statusText}`);
      } else {
        console.log(gifResponse);
        return gifResponse.json();
      }
    })
    .then((gifData) => {
      console.log(gifData);
      updateBackground(gifData.data.images.original.url);
    })
    .catch((error) => {
      console.error('something went wrong', error);
    });
}

function getAltCurrentWeather(city) {
  return fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`,
    { mode: 'cors' }
  );
}

function getAltForecast(city) {
  return fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&cnt=4&appid=${weatherAPI}`,
    { mode: 'cors' }
  );
}

function altGetGifByID(iconID) {
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
  let url = `https://api.giphy.com/v1/gifs/${gifID}?api_key=${giphyAPI}`;
  let gifID;

  if (iconID === '01d') {
    console.log('clear sky day');
    gifID = clearSkyDayGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '01n') {
    console.log('clear sky night');
    gifID = clearSkyNightGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '02d') {
    console.log('few clouds day');
    gifID = fewCloudsDayGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '02n') {
    console.log('few clouds night');
    gifID = fewCloudsNightGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '03d') {
    console.log('scattered clouds day');
    gifID = scatteredCloudsDayGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '03n') {
    console.log('scattered clouds night');
    gifID = scatteredCloudsNightGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '04d') {
    console.log('cloudy day');
    gifID = cloudyDayGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '04n') {
    console.log('cloudy night');
    gifID = cloudyNightGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '11d' || iconID === '11n') {
    console.log('thunderstorm');
    gifID = thunderstormGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '13d' || iconID === '13n') {
    console.log('snow');
    gifID = snowGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (iconID === '50d' || iconID === '50n') {
    console.log('fog');
    gifID = fogGifID;
    url = url.replace('undefined', gifID);
    return fetch(url);
  } else if (
    iconID === '09d' ||
    iconID === '09n' ||
    iconID === '10d' ||
    iconID === '10n'
  ) {
    gifID = rainGifID;
    url = url.replace('undefined', gifID);
    console.log('rain');
    return fetch(url);
  }
}
