import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function forecastAvailable(bool) {
    return {
        type: 'FORECAST_AVAILABLE',
        status: bool
    };
}

export function lastForecast (weather) {
    return {
        type: 'LAST_FORECAST',
        forecastForCards: weather.forecastForCards,
        forecastForGraph: weather.forecastForGraph,
    };
}

const kelvinToCelcius = (k) => Number(Number(k - 273.15).toFixed(1))
const moreCommonItem = (arr) => {
  return arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length).pop();
}
  
const formatWeather = (json) => {
  if (json.cod !== "200") {
    throw new Error()
  }
  // Forecast Cards
  let weather = new Map()
  json.list.map((e) => {
    let day = (new Date(e.dt * 1000)).toLocaleDateString("en-US", { weekday: 'long' })
    let d
    if (!weather.has(day)) {
      if (weather.size > 4) {
        return 0
      }
      d = { minTemp: Infinity, maxTemp: -Infinity, icon: [], hasRain: false }
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
    if ("rain" in e || "snow" in e) {
      d.hasRain = true
    }
    weather.set(day, d)
    return 0
  })
  weather.forEach((v, k) => {
    v.minTemp = kelvinToCelcius(v.minTemp)
    v.maxTemp = kelvinToCelcius(v.maxTemp)
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
    a.get("http://api.openweathermap.org/data/2.5/forecast?id=6613142&mode=json&appid=6e2218dcec22c786e4a039dfe3bfae98&lang=fr&units=metrics")
    .then((res) => res.data)
    .then(formatWeather)
    .then((w) => {
      dispatch(forecastAvailable(true))
      dispatch(lastForecast(w))
    })
    .catch((e) => dispatch(forecastAvailable(false)))
  }
}
