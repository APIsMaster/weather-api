const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', (req, res) => {
  res.json('Welcome To The Best Weather Api On The Planet')
})


app.get('/today', (req, res) => {
  const lat = req.query.lat
  const lan = req.query.lan
  
  if (lat & lan) {
    axios.get(`https://weather.com/weather/today/l/${lat},${lan}`).then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const location = $(html).find('h1[class^="CurrentConditions--location"]').text()
      const temp_f = Number($(html).find('span[class^="CurrentConditions--tempValue"]').text().replace('°', ''))
      const conditionText = $(html).find('div[class^="CurrentConditions--phraseValue"]').text()

      const day_temp_f = Number($(html).find('div[class^="CurrentConditions--tempHiLoValue"]').find('span:first').text().replace('°', ''))
      const night_temp_f = Number($(html).find('div[class^="CurrentConditions--tempHiLoValue"]').find('span:last').text().replace('°', ''))
      const morning_temp_f = Number($(html).find('div[class^="TodayWeatherCard"]').find('li:first').find('a').find('div[class^="Column--temp"]').find('span').text().replace('°', ''))
      const afternoon_temp_f = Number($(html).find('div[class^="TodayWeatherCard"]').find('li:nth-child(2)').find('a').find('div[class^="Column--temp"]').find('span').text().replace('°', ''))
      const evening_temp_f = Number($(html).find('div[class^="TodayWeatherCard"]').find('li:nth-child(3)').find('a').find('div[class^="Column--temp"]').find('span').text().replace('°', ''))
      const Overnight_temp_f = Number($(html).find('div[class^="TodayWeatherCard"]').find('li:last').find('a').find('div[class^="Column--temp"]').find('span').text().replace('°', ''))

      const wind_mph = Number($(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(2)').find('div[class^="WeatherDetailsListItem--wxData"]').find('span').text().replace('Wind Direction', '').replace('mph', ''))

      const humidity = Number($(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(3)').find('div[class^="WeatherDetailsListItem--wxData"]').find('span').text().replace('%', ''))

      const dew_point_f = Number($(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(4)').find('div[class^="WeatherDetailsListItem--wxData"]').find('span').text().replace('°', ''))


      const pressure_in = Number($(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(5)').find('div[class^="WeatherDetailsListItem--wxData"]').find('span').text().replace('Arrow', '').replace('Down', '').replace('Up', '').replace('in', ''))

      const visibility_mi = Number($(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(7)').find('div[class^="WeatherDetailsListItem--wxData"]').find('span').text().replace('mi', ''))

      const uv = $(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(6)').find('div[class^="WeatherDetailsListItem--wxData"]').find('span').text()

      const MoonPhase = $(html).find('div[class^="TodayDetailsCard--detailsContainer"]').find('div:nth-child(8)').find('div[class^="WeatherDetailsListItem--wxData"]').text()

      const round = (num) => Math.round(num * 100) / 100
      const FToC = (temp_f) => round((temp_f - 32) * 5 / 9)
      const data = {
        location,
        lat,
        lan,
        weather: {
          temp_c: FToC(temp_f),
          temp_f,
          condition: {
            text: conditionText,
            // icon: ''
          },
          day_temp_c: FToC(day_temp_f),
          day_temp_f,
          night_temp_c: FToC(night_temp_f),
          night_temp_f,
          one_day_forecast: {
            morning_temp_c: FToC(morning_temp_f),
            morning_temp_f,
            afternoon_temp_c: FToC(afternoon_temp_f),
            afternoon_temp_f,
            evening_temp_c: FToC(evening_temp_f),
            evening_temp_f,
            Overnight_temp_c: FToC(Overnight_temp_f),
            Overnight_temp_f
          },
          humidity,
          pressure_mb: round(pressure_in * 33.8637526),
          pressure_in,
          visibility_mi,
          visibility_km: round(visibility_mi * 1.609),
          wind_mph,
          wind_kph: round(wind_mph * 1.609),
          dew_point_c: FToC(dew_point_f),
          dew_point_f,
          uv,
          MoonPhase
        }
      }
      res.json(data)
    })
  } else {

    res.json('Send all the required data')
  }


})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))