import { config } from "../config.js"

import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function forecastAvailable(bool) {
  return {
    type: "FORECAST_AVAILABLE",
    status: bool
  }
}

export function lastForecast (weather) {
  return {
    type: "LAST_FORECAST",
    forecastForCards: weather.forecastForCards,
    forecastForGraph: weather.forecastForGraph,
  }
}

const kelvinToCelcius = (k) => Number(Number(k - 273.15).toFixed(1))
const moreCommonItem = (arr) => {
  return arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length).pop()
}
  
const formatWeather = (json) => {
  if (json.cod !== "200") {
    throw new Error()
  }
  // Forecast Cards
  let weather = new Map()
  json.list.map((e) => {
    let day = (new Date(e.dt * 1000)).toLocaleDateString("en-US", { weekday: "long" })
    let d
    if (!weather.has(day)) {
      if (weather.size > 4) {
        return 0
      }
      d = { minTemp: Infinity, maxTemp: -Infinity, icon: [], water: [] }
    } else {
      d = weather.get(day)
    }
    if (e.main.temp_min < d.minTemp) {
      d.minTemp = e.main.temp_min
    }
    if (e.main.temp_max > d.maxTemp) {
      d.maxTemp = e.main.temp_max
    }
    d.icon.push(e.weather[0].id)
    if ("rain" in e && "3h" in e.rain) {
      d.water.push(e.rain["3h"])
    }
    if ("snow" in e && "3h" in e.snow) {
      d.water.push(e.snow["3h"])
    }
    weather.set(day, d)
    return 0
  })
  weather.forEach((v) => {
    v.minTemp = kelvinToCelcius(v.minTemp)
    v.maxTemp = kelvinToCelcius(v.maxTemp)
    let water = v.water.reduce((a, b) => a + b, 0)
    v.hasRain = (water > 0.2) ? true : false
    v.icon = moreCommonItem(v.icon)
  })
  // Graph
  let graph = json.list.map((e) => {
    return {
      dt: new Date(e.dt * 1000),
      t: kelvinToCelcius(e.main.temp),
      p: e.main.pressure,
      h: e.main.humidity,
      c: e.clouds.all,
      w: e.wind.speed,
      r: (e.rain) ? e.rain["3h"] : 0
    }
  })
  return { forecastForCards: weather, forecastForGraph: graph }
}

export function getLastForecast() {
  return (dispatch) => {
    a.get(`http://api.openweathermap.org/data/2.5/forecast?q=${config.FORECAST_CITY}&mode=json&appid=6e2218dcec22c786e4a039dfe3bfae98&lang=fr&units=metrics`)
      .then((res) => res.data)
      .then(formatWeather)
      .then((w) => {
        dispatch(forecastAvailable(true))
        dispatch(lastForecast(w))
      })
      .catch(() => dispatch(forecastAvailable(false)))
  }
}
