export function getForecastsSuccess (weather) {
    return {
        type: 'GET_FORECASTS_SUCCESS',
        forecast: weather.forecast,
        forecastGraph: weather.forecastGraph,
    };
}


const kelvinToCelcius = (k) => Number(Number(k - 273.15).toFixed(1))
const moreCommon = (arr) => {
  return arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length).pop();
}
  
const formatWeather = (json) => {
  if (json.cod !== "200") {
    throw new Error()
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let weather = new Map()
  json.list.map((e) => {
    let day = days[(new Date(e.dt * 1000)).getDay()]
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
    if ("rain" in e) {
      d.hasRain = true
    }
    weather.set(day, d)
    return 0
  })
  weather.forEach((v, k) => {
    v.minTemp = kelvinToCelcius(v.minTemp)
    v.maxTemp = kelvinToCelcius(v.maxTemp)
    v.icon = moreCommon(v.icon)
  })
  // Graph
  let graph = json.list.map((e) => {
    let date = new Date(e.dt * 1000)
    return {
      dt: days[date.getDay()].slice(0, 3) + " " + (date.getHours() + 1) + "h",
      t: kelvinToCelcius(e.main.temp),
      p: e.main.pressure,
      h: e.main.humidity,
      c: e.clouds.all,
      w: e.wind.speed,
      r: (e.rain) ? e.rain["3h"] : 0
    }
  })
  return { forecast: weather, forecastGraph: graph }
}

export function getForecasts() {
  return (dispatch) => {
    fetch("http://api.openweathermap.org/data/2.5/forecast?id=6613142&mode=json&appid=6e2218dcec22c786e4a039dfe3bfae98&lang=fr&units=metrics")
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then(formatWeather)
    .then((w) => dispatch(getForecastsSuccess(w)))
    .catch((e) => { console.error(e); dispatch(getForecastsSuccess)});
  }
}
