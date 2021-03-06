import { config } from "../config.js"

import axios from "axios"

let a = axios.create()
a.defaults.timeout = 3000

export function lastSensorsMetrics(metrics) {
  return {
    type: "LAST_SENSORS_METRICS",
    metrics
  }
}
  
  
const getMetric = (cm, m) => {
  if (cm && cm.values && cm.columns) {
    return cm.values[0][cm.columns.indexOf(m)]
  }
  return
}

const average = (arr) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length

const getPressureTendency = (cm) => {
  if (cm && cm.values && cm.columns) {
    let index = cm.columns.indexOf("last_P")
    let values = cm.values.map((e) => e[index])
    let last20 = values.slice(-20)
    let rest = values.slice(0, values.length - 20)
    if (average(last20) > average(rest)) {
      return 1
    } else {
      return -1
    }
  }
  return
}

const formatMetrics = (metrics) => {
  return {
    T: getMetric(metrics, "last_T"),
    H: getMetric(metrics, "last_H"),
    P: getPressureTendency(metrics)
  }
}

export function getLastSensorsMetrics() {
  return (dispatch) => {
    a.get(`http://${config.API_HOST}:${config.API_PORT}/api/last-sensors-metrics`)
      .then((json) => formatMetrics(json.data))
      .then((m) => dispatch(lastSensorsMetrics(m)))
      .catch(() => dispatch(lastSensorsMetrics()))
  }
}
