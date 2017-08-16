import { config } from "../config.js"

import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function sensorsHistory(sensorsHistory) {
  return {
    type: "SENSORS_HISTORY",
    sensorsHistory
  }
}

export function sensorsHistoryAvailable (status) {
  return {
    type: "SENSORS_HISTORY_AVAILABLE",
    status
  }
}

function formatJSON (json) {
  let o = {}
  json.columns.forEach((value, key) => {
    let val
    if (value === "time") {
      val = json.values.map((e) => new Date(e[key])) 
    } else {
      val = json.values.map((e) => (e[key] !== null) ? Number(e[key]).toFixed(1) : null) 
    }
    o[value] = val
  })
  return o
}

export function getSensorsHistory(since, groupBy) {
  return (dispatch) => {
    a.get(`http://${config.API_HOST}:${config.API_PORT}/api/sensors-metrics?since=${since}&groupBy=${groupBy}`)
      .then((j) => formatJSON(j.data))
      .then((metrics) => {
        dispatch(sensorsHistoryAvailable(true))
        dispatch(sensorsHistory(metrics))
      })
      .catch(() => dispatch(sensorsHistoryAvailable(false)))
  }
}
