export function lastForecast(state = { forecastForCards: new Map(), forecastForGraph: []}, action) {
  switch (action.type) {
  case "LAST_FORECAST":
    return { forecastForCards: action.forecastForCards, forecastForGraph: action.forecastForGraph }
  default:
    return state
  }
}

export function forecastAvailable(state = false, action) {
  switch (action.type) {
  case "FORECAST_AVAILABLE":
    return action.status
  default:
    return state
  }
}
