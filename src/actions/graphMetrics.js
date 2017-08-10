import { config } from "../config.js"

import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function graphMetricsFetchDataSuccess(metrics) {
    return {
        type: 'GRAPH_METRICS_FETCH_DATA_SUCCESS',
        metrics
    };
}
  
  
export function graphMetrics() {
  return (dispatch) => {
    a.get(`https://${config.API_HOST}:${config.API_PORT}/api/sensortag2000`)
    .then((json) => dispatch(graphMetricsFetchDataSuccess(json.data)))
    .catch((e) => console.log(e));
  }
}
