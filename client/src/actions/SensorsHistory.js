import { config } from "../config.js"

import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function sensorsHistory(sensorsHistory) {
    return {
        type: 'SENSORS_HISTORY',
        sensorsHistory
    };
}

export function sensorsHistoryAvailable (status) {
    return {
        type: 'SENSORS_HISTORY_AVAILABLE',
        status
    };
}

export function getSensorsHistory() {
  return (dispatch) => {
    a.get(`https://${config.API_HOST}:${config.API_PORT}/api/sensortag2000`)
    .then((json) => {
      dispatch(sensorsHistoryAvailable(true))
      dispatch(sensorsHistory(json.data))
    })
    .catch((e) => dispatch(sensorsHistoryAvailable(false)))
  }
}
