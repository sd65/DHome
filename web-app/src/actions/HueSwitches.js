import { config } from "../config.js"

import axios from "axios"

let a = axios.create()
a.defaults.timeout = 1000

export function hueLightsReachable(bool) {
  return {
    type: "HUE_LIGHTS_REACHABLE",
    status: bool
  }
}

export function hueSwitchesAllSuccess() {
  return {
    type: "HUE_SWITCHES_ALL_SUCCESS"
  }
}

export function hueSwitchSuccess() {
  return {
    type: "HUE_SWITCH_SUCCESS"
  }
}

export function hueSwitchesAllStatus(status) {
  return {
    type: "HUE_SWITCHES_ALL_STATUS",
    status
  }
}

export function setHueLightsStatus(bool) {
  return (dispatch) => {
    let options = {
      method: (bool) ? "POST" : "DELETE"
    }
    a.get(`http://${config.API_HOST}:${config.API_PORT}/api/lights`, options)
      .then(() => dispatch(hueSwitchesAllSuccess()))
      .catch(() => dispatch(hueLightsReachable(false)))
  }
}

export function setHueLightStatus(id, bool) {
  return (dispatch) => {
    let options = {
      method: (bool) ? "POST" : "DELETE"
    }
    a.get(`http://${config.API_HOST}:${config.API_PORT}/api/lights/${id}`, options)
      .then(() => dispatch(hueSwitchSuccess()))
      .catch(() => dispatch(hueLightsReachable(false)))
  }
}

export function getHueLightsStatus() {
  return (dispatch) => {
    a.get(`http://${config.API_HOST}:${config.API_PORT}/api/lights`)
      .then((response) => response.data)
      .then((json) => {
        dispatch(hueLightsReachable(true))
        dispatch(hueSwitchesAllStatus(json))
      })
      .catch(() => dispatch(hueLightsReachable(false)))
  }
}
